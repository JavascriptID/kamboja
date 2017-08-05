import "reflect-metadata"
import * as Core from "kamboja-core"
import { Invoker } from "./invoker"
import { HttpStatusError } from "../../"
import { ErrorInvocation, SocketControllerInvocation, HttpControllerInvocation } from "./invocations"

export class RequestHandler {
    constructor(private option: Core.Facade,
        private context: Core.HttpRequest,
        private response: Core.Response,
        private target?: Core.RouteInfo | Error) { }

    async execute() {
        let invoker = new Invoker(this.option)
        try {
            let invocation: Core.Invocation;
            let routeInfo: Core.RouteInfo | undefined;
            if (!this.target) {
                invocation = new ErrorInvocation(new HttpStatusError(404, "Requested url not found"))
            }
            else if (this.target instanceof Error)
                invocation = new ErrorInvocation(this.target)
            else {
                routeInfo = this.target
                invocation = new HttpControllerInvocation(this.option, this.context, routeInfo)
            }

            let result = await invoker.invoke(this.context, invocation)
            await result.execute(this.context, this.response, routeInfo)
        }
        catch (e) {
            this.response.send({ body: e.message, status: e.status || 500 })
        }
    }
}