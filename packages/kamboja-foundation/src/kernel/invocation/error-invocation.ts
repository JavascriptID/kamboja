import * as Core from "kamboja-core"

export class ErrorInvocation extends Core.Invocation {
    constructor() { super() }

    proceed(): Promise<Core.ActionResult> {
        throw this.parameters[0]
    }
}