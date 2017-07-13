import { Core, RequestHandler } from "kamboja"
import * as SocketIo from "socket.io"
import { ResponseAdapter } from "./response-adapter"
import { SocketAdapter } from "./socket-adapter"

export class SocketIoEngine implements Core.Engine {
    init(routes: Core.RouteInfo[], option: Core.KambojaOption) {
        let io = SocketIo();
        let connectionEvents = routes.filter(x => x.route == "connection")
        let errorEvents = routes.filter(x => x.route == "error")
        let socketEvents = routes.filter(x => x.route != "error" && x.route != "connection")
        io.on("connection", socket => {
            connectionEvents.forEach(route => {
                let requestHandler = new RequestHandler(option,
                    new SocketAdapter(socket),
                    new ResponseAdapter(socket), route)
                requestHandler.execute()
            })

            socketEvents.forEach(route => {
                io.on(route.route!, (msg: any, callback: (body: any) => void) => {
                    let handler = new RequestHandler(option, new SocketAdapter(socket),
                        new ResponseAdapter(socket, callback), route, msg)
                    handler.execute()
                })
            })

            io.on("error", (err:any) => {
                errorEvents.forEach(route => {
                    let requestHandler = new RequestHandler(option,
                        new SocketAdapter(socket),
                        new ResponseAdapter(socket), err)
                    requestHandler.execute()
                })
            })
        })
    }
}