import {Invocation, ActionResult, Middleware, RouteInfo, Facade} from "kamboja-core"

export class AttachableInvocation extends Invocation {
    private invocation: Invocation;

    constructor(public middlewares:Middleware[], public controllerInfo:RouteInfo, public facade:Facade){ super() }

    attach(invocation: Invocation) {
        invocation.controllerInfo = this.controllerInfo
        invocation.middlewares = this.middlewares
        invocation.facade = this.facade;
        this.invocation = invocation;
    }

    proceed(): Promise<ActionResult> {
        this.invocation.context = this.context;
        this.invocation.parameters = this.parameters
        return this.invocation.proceed()
    }
}
