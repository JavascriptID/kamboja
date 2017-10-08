import { middleware, Middleware, Handshake, Invocation, ActionResult } from "../../../src"
import { Request } from "express"

@middleware.id("kamboja-express:global")
export class GlobalInterceptor implements Middleware {
    async execute(context: Request, next: Invocation): Promise<ActionResult> {
        if (context.url == "/unhandled/url") {
            return new ActionResult("HELLOW!!")
        }
        return next.proceed()
    }

}