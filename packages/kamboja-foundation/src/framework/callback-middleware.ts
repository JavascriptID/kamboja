import { Middleware } from "./middleware-base"
import { Handshake, HttpRequest, Invocation, ActionResult, MiddlewareFunction } from "kamboja-core"

export class CallbackMiddleware extends Middleware {
    constructor(private callback: MiddlewareFunction) { super() }

    execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult> {
        return this.callback(context, next)
    }
}

export function mdw(callback:MiddlewareFunction){
    return new CallbackMiddleware(callback)
}