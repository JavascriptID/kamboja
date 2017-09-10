import {Invocation, ActionResult} from "kamboja-core"

export class AttachableInvocation extends Invocation {
    private invocation: Invocation;

    attach(invocation: Invocation) {
        this.invocation = invocation;
        this.context = invocation.context;
        this.controllerInfo = invocation.controllerInfo
        this.middlewares = invocation.middlewares
        this.parameters = invocation.parameters
    }

    proceed(): Promise<ActionResult> {
        return this.invocation.proceed()
    }
}
