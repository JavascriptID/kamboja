import { Core, RequestHandler, HttpStatusError, Invoker, SocketControllerInvocation, ErrorInvocation } from "kamboja"
import * as SocketIo from "socket.io"
import { SocketResponse } from "./socket-response"
import { SocketIoHandshake } from "./socket-handshake"
import { SocketAdapter } from "./socket-adapter"

export class OnConnectionInvocation extends Core.Invocation {
    async proceed(): Promise<Core.ActionResult> {
        return new Core.ActionResult({}, 200)
    }
}

class SocketHandler {
    constructor(private option: Core.Facade) { }
    async execute(handshake: Core.Handshake, response: Core.Response, invocation: Core.Invocation) {
        try {
            let invoker = new Invoker(this.option)
            let result = await invoker.invoke(handshake, invocation)
            await result.execute(handshake, response)
        }
        catch (e) {
            response.send({ status: 500, body: e.message })
        }
    }
}

export class SocketIoEngine implements Core.Engine {
    constructor(private server: SocketIO.Server, private registry: Core.SocketRegistry) { }

    init(routes: Core.RouteInfo[], option: Core.KambojaOption) {
        let connectionEvents = routes.filter(x => x.route == "connection")
        let errorEvents = routes.filter(x => x.route == "error")
        let socketEvents = routes.filter(x => x.route != "error" && x.route != "connection")
        let handler = new SocketHandler(option)

        this.server.on("connection", socket => {
            /*
            this handler will executed on each connection created
            all route of type SocketController named "connection" 
            will be called.
            If no handler found it is required to execute the system 
            once, to make sure authentication process in middlewares called.
            */

            if (connectionEvents.length == 0) {
                let handshake = new SocketIoHandshake(socket)
                let response = new SocketResponse(new SocketAdapter(socket))
                handler.execute(handshake, response, new OnConnectionInvocation())
            }
            else {
                connectionEvents.forEach(route => {
                    let handshake = new SocketIoHandshake(socket)
                    let response = new SocketResponse(new SocketAdapter(socket))
                    handler.execute(handshake, response, new SocketControllerInvocation(option, handshake, route))
                })
            }

            socketEvents.forEach(route => {
                socket.on(route.route!, (msg: any, callback: (body: any) => void) => {
                    let handshake = new SocketIoHandshake(socket)
                    let response = new SocketResponse(new SocketAdapter(socket), callback)
                    handler.execute(handshake, response, new SocketControllerInvocation(option, handshake, route, msg))
                })
            })

            socket.on("error", (err: any) => {
                errorEvents.forEach(route => {
                    let handshake = new SocketIoHandshake(socket)
                    let response = new SocketResponse(new SocketAdapter(socket))
                    handler.execute(handshake, response, new ErrorInvocation(err))
                })
            })
        })
        return this.server;
    }
}
