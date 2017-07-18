import { Core } from "kamboja"
import { SocketResponse } from "./socket-response"
export class RealTimeMiddleware implements Core.Middleware {
    constructor(private server: SocketIO.Server, private registry: Core.SocketRegistry) { }
    async execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        let result = await next.proceed();
        if (context.contextType == "HttpRequest" && result.events) {
            if (!context.user && result.events.some(e => e.type == "Private"))
                throw new Error("Private SocketEvent require and authenticated request")
            let socketId = await this.registry.lookup(context.user.id)
            let socket = this.server.sockets.connected[socketId]
            await result.execute(context, new SocketResponse(this.registry, socket))
            return result;
        }
        else
            return result
    }
}