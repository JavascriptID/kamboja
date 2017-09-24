import { Core, HttpStatusError, Kernel } from "kamboja-foundation"
import { SocketResponse } from "./socket-response"
import { SocketIoHandshake } from "./socket-handshake"
import { SocketAdapter } from "./socket-adapter"
import * as SocketIo from "socket.io"
import * as Http from "http"

export class SocketIoEngine implements Core.Engine {
    constructor(private server: SocketIO.Server, private registry: Core.SocketRegistry) { }

    init(routes: Core.RouteInfo[], option: Core.KambojaOption, app?:any) {
        let connectionEvents = routes.filter(x => x.route == "connection")
        let socketEvents = routes.filter(x => x.route != "connection")

        this.server.on("connection", async socket => {
            /*
            If no handler found it is required to execute the system 
            once, to make sure authentication process in middlewares called.
            */

            if (connectionEvents.length == 0) {
                let handler = new Kernel.RequestHandler(option)
                await handler.execute(new SocketIoHandshake(socket), 
                    new SocketResponse(new SocketAdapter(socket)))
            }
            else {
                connectionEvents.forEach(async route => {
                    let handler = new Kernel.RequestHandler(option, route)
                    await handler.execute(new SocketIoHandshake(socket),
                        new SocketResponse(new SocketAdapter(socket)))
                })
            }

            socketEvents.forEach(route => {
                socket.on(route.route!, async (msg: any, callback: (body: any) => void) => {
                    let handler = new Kernel.RequestHandler(option, route)
                    await handler.execute(new SocketIoHandshake(socket, msg),
                        new SocketResponse(new SocketAdapter(socket), callback))
                })
            })
        })
        this.server.listen(app)
        return this.server;
    }
}
