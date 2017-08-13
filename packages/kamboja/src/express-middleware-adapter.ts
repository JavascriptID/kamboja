import { Core, Middleware } from "kamboja-foundation"
import { MiddlewareActionResult } from "./middleware-action-result"
import { RequestHandler } from "express"
import { ResponseAdapter } from "./response-adapter"
import { RequestAdapter } from "./request-adapter"

export class ExpressMiddlewareAdapter implements Core.Middleware {
    constructor(private middleware: RequestHandler) { }
    async execute(request: Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return new MiddlewareActionResult(this.middleware, async (req, res) => {
            let actionResult = await next.proceed();
            await actionResult.execute!(req, res)
        })
    }
}