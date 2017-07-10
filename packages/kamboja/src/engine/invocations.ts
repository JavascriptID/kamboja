import * as Core from "kamboja-core"

export class MiddlewareInvocation extends Core.Invocation {
    constructor(private invocation: Core.Invocation, private context: any, private middleware: Core.Middleware) {
        super()
        this.controllerInfo = invocation.controllerInfo
        this.middlewares = invocation.middlewares
    }

    async proceed(): Promise<Core.BaseActionResult> {
        return this.middleware.execute(this.context, this.invocation)
    }
}


export class ErrorInvocation extends Core.Invocation {
    constructor(private error: any) { super() }

    async proceed(): Promise<Core.BaseActionResult> {
        throw this.error
    }
}