import { Middleware, HttpRequest, Handshake, Response, Invocation, ActionResult } from "kamboja-core"


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

export class AttachableInvocation extends Invocation {
    private invocation: Invocation;

    attach(invocation: Invocation) {
        this.invocation = invocation;
    }

    proceed(): Promise<ActionResult> {
        return this.invocation.proceed()
    }
}


export class MiddlewarePipeline {
    head: AttachableInvocation;
    tail: Invocation;

    constructor(middlewares: Middleware[]) {
        this.tail = this.head = new AttachableInvocation()
        middlewares.forEach(x => this.tail = new MiddlewareInvocation(x, this.tail))
    }

    execute(invocation: Invocation) {
        this.head.attach(invocation)
        return this.tail.proceed()
    }
}