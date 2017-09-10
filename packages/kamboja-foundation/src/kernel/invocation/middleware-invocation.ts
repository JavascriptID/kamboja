import { Middleware, Invocation, ActionResult } from "kamboja-core"


export class MiddlewareInvocation extends Invocation {
    constructor(private middleware: Middleware, private next: Invocation) {
        super()
        this.controllerInfo = this.next.controllerInfo
        this.middlewares = this.next.middlewares
   }

    async proceed(): Promise<ActionResult> {
        this.context = this.next.context;
       return this.middleware.execute(this.context, this.next)
    }
}
