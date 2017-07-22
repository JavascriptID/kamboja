import { Core, RequestHandler, HttpStatusError, Invoker } from "kamboja"
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
                let invoker = new Invoker(option)
                invoker.invoke(new SocketIoHandshake(socket), new OnConnectionInvocation())
                    .catch(er => {
                        new SocketResponse(this.registry, socket)
                            .send({body: er.message, status: er.status || 500})
                    })
            }
            else {
                connectionEvents.forEach(route => {
                    let requestHandler = new RequestHandler(option,
                        new SocketIoHandshake(socket),
                        new SocketResponse(this.registry, socket), route)
                    requestHandler.execute()
                })
            }
            

            socketEvents.forEach(route => {
                socket.on(route.route!, (msg: any, callback: (body: any) => void) => {
                    let handler = new RequestHandler(option, new SocketIoHandshake(socket),
                        new SocketResponse(this.registry, socket, callback), route, msg)
                    handler.execute()
                })
            })

            this.server.on("error", (err:any) => {
                errorEvents.forEach(route => {
                    let requestHandler = new RequestHandler(option,
                        new SocketIoHandshake(socket),
                        new SocketResponse(this.registry, socket), err)
                    requestHandler.execute()
                })
            })
        })
        return this.server;
    }
}
