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

        let result = await next.proceed();

        /*
        validate action result events, and swap back user id to socket id
        */
        if (result.events) {
            for (let event of result.events) {
                if (event.type == "Private") {
                    if (!event.id) throw new Error(`Event id can't be null on 'emit' function`)
                    if (!Array.isArray(event.id)) event.id = [event.id]
                    let ids = await Promise.all(event.id.map(id => this.registry.lookup(id)))
                    ids.forEach((id, i) => {
                        if(!id) throw new Error(`Can't emit event to user id [${event.id![i]}] because appropriate socket is not found`)
                    })
                    event.id = ids;
                }
            }
        }

        /*
        Process below will give all HTTP Controllers ability to send socket events
        */
        if (context.contextType == "HttpRequest" && result.events) {
            let response = new SocketResponse(new ServerSocketAdapter(this.server))
            await response.send(result)
            return result;
        }
        else
            return result
    }
}