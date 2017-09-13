import * as Core from "kamboja-core"

export class ErrorInvocation extends Core.Invocation {
    constructor(private error: any) { super() }

    proceed(): Promise<Core.ActionResult> {
        throw this.error
    }
}