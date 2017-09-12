import { Middleware, Invocation, ActionResult, RouteInfo } from "kamboja-core"


export class MiddlewareInvocation extends Invocation {
    constructor(private middleware: Middleware, private next: Invocation) {
        super()
    }

    async proceed(): Promise<ActionResult> {
        this.next.context = this.context;
        this.next.parameters = this.parameters;
        return this.middleware.execute(this.context, this.next)
    }
}
