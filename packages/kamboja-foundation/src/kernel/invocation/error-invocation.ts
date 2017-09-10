import * as Core from "kamboja-core"

export class ErrorInvocation extends Core.Invocation {
    constructor(private error: any) { super() }

    async proceed(): Promise<Core.ActionResult> {
        throw this.error
    }
}