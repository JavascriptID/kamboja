import "reflect-metadata"
import * as Core from "kamboja-core"
import { Invoker } from "./invoker"
import { HttpStatusError } from "../../"
import { ErrorInvocation, SocketControllerInvocation, HttpControllerInvocation } from "./invocations"

export class RequestHandler {
    constructor(private option: Core.Facade,
        private context: Core.HttpRequest | Core.Socket,
        private response: Core.Response,
        private target?: Core.RouteInfo | Error,
        private params?: any) { }

    async execute() {
        let invoker = new Invoker(this.option)
        try {
            let invocation: Core.Invocation;
            let routeInfo: Core.RouteInfo | undefined;
            if (!this.target) {
                let msg = this.context.contextType == "HttpRequest" ? "Requested url not found" : "Invalid event"
                invocation = new ErrorInvocation(new HttpStatusError(404, msg))
            }
            else if (this.target instanceof Error)
                invocation = new ErrorInvocation(this.target)
            else {
                routeInfo = this.target;
                if (this.context.contextType == "Socket")
                    invocation = new SocketControllerInvocation(this.option, this.context, routeInfo, this.params || [])
                else
                    invocation = new HttpControllerInvocation(this.option, this.context, routeInfo)
            }

            let result = await invoker.invoke(this.context, invocation)
            await result.execute(this.context, this.response, routeInfo)
        }
        catch (e) {
            this.response.body = e.message
            this.response.status = e.status || 500
            this.response.send()
        }
    }
}