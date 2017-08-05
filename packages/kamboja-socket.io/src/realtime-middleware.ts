import { Core } from "kamboja"
import { SocketResponse } from "./socket-response"
import { ServerSocketAdapter } from "./socket-adapter"

export class RealTimeMiddleware implements Core.Middleware {
    constructor(private server: SocketIO.Server, private registry: Core.SocketRegistry) { }
    async execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        /*
        In this step we register an ALIAS for all connected socket ID, further we can use it 
        to lookup socket by USER ID used in SocketResponse.
        This middleware should have lower priority than Authentication middleware that
        add user information in context
        */
        if (context.contextType == "Handshake" && context.user) {
            this.registry.register(context.id, context.user.id)
        }

        /*
        Process below will give all HTTP Controllers ability to send socket events
        */
        let result = await next.proceed();
        if (context.contextType == "HttpRequest" && result.events) {
            let response = new SocketResponse(this.registry, new ServerSocketAdapter(this.server))
            await response.send(result)
            return result;
        }
        else
            return result
    }
}