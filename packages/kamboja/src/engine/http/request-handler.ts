import "reflect-metadata"
import * as Core from "kamboja-core"
import { Invoker } from "../invoker"
import { ParameterBinder } from "../../parameter-binder"
import { HttpStatusError } from "../../"
import { ControllerInvocation } from "./controller-invocation"
import { ErrorInvocation } from "../invocations"

export class RequestHandler {
    constructor(private option: Core.Facade,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse,
        private data?: Core.RouteInfo | Error) { }

    async execute() {
        let invoker = new Invoker(this.option)
        try {
            let invocation: Core.Invocation;
            if (!this.data) 
                invocation = new ErrorInvocation(new HttpStatusError(404, "Requested page is not found"))
            else if (this.data instanceof Error) 
                invocation = new ErrorInvocation(this.data)
            else 
                invocation = new ControllerInvocation(this.option, this.data)

            let result = await invoker.invoke(this.request, invocation)
            await result.execute(this.request, this.response)
        }
        catch (e) {
            this.response.body = e.message
            this.response.status = e.status || 500
            this.response.send()
        }
    }
}