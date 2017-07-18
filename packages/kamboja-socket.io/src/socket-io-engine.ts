import { Core, RequestHandler } from "kamboja"
import * as SocketIo from "socket.io"
import { SocketResponse } from "./socket-response"
import { SocketIoHandshake } from "./socket-handshake"

export class SocketIoEngine implements Core.Engine {
    constructor(private server:SocketIO.Server, private registry:Core.SocketRegistry){}

    init(routes: Core.RouteInfo[], option: Core.KambojaOption) {
        let connectionEvents = routes.filter(x => x.route == "connection")
        let errorEvents = routes.filter(x => x.route == "error")
        let socketEvents = routes.filter(x => x.route != "error" && x.route != "connection")
        
        this.server.on("connection", socket => {
            connectionEvents.forEach(route => {
                let requestHandler = new RequestHandler(option,
                    new SocketIoHandshake(socket),
                    new SocketResponse(), route)
                requestHandler.execute()
            })

            socketEvents.forEach(route => {
                this.server.on(route.route!, (msg: any, callback: (body: any) => void) => {
                    let handler = new RequestHandler(option, new SocketIoHandshake(socket),
                        new SocketResponse(this.registry, socket, callback), route, msg)
                    handler.execute()
                })
            })

            this.server.on("error", (err:any) => {
                errorEvents.forEach(route => {
                    let requestHandler = new RequestHandler(option,
                        new SocketIoHandshake(socket),
                        new SocketResponse(), err)
                    requestHandler.execute()
                })
            })
        })
        return this.server;
    }
}
