import { Core, RequestHandler, HttpStatusError } from "kamboja"
import * as SocketIo from "socket.io"
import { SocketResponse } from "./socket-response"
import { SocketIoHandshake } from "./socket-handshake"

export class OnConnectionInvocation extends Core.Invocation {
    async proceed(): Promise<Core.ActionResult> {
        return new Core.ActionResult({}, 200)
    }
}

export class SocketIoEngine implements Core.Engine {
    constructor(private server:SocketIO.Server, private registry:Core.SocketRegistry){}

    init(routes: Core.RouteInfo[], option: Core.KambojaOption) {
        let connectionEvents = routes.filter(x => x.route == "connection")
        let errorEvents = routes.filter(x => x.route == "error")
        let socketEvents = routes.filter(x => x.route != "error" && x.route != "connection")
        
        this.server.on("connection", socket => {
            /*
            this handler will executed on each connection created
            all route of type SocketController named "connection" 
            will be called.
            If no handler found it is required to execute the system 
            once, to make sure authentication process in middlewares called.
            */
            if(connectionEvents.length == 0){
                let requestHandler = new RequestHandler(option,
                    new SocketIoHandshake(socket),
                    new SocketResponse(), new HttpStatusError(400))
                requestHandler.execute()
            }
            else {
                connectionEvents.forEach(route => {
                    let requestHandler = new RequestHandler(option,
                        new SocketIoHandshake(socket),
                        new SocketResponse(), route)
                    requestHandler.execute()
                })
            }
            

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
