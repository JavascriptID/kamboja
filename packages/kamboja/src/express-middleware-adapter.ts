import { Middleware } from "kamboja-foundation"
import { MiddlewareActionResult } from "./action-result"
import { RequestHandler } from "express"
import * as Core from "kamboja-core"

export class ExpressMiddlewareAdapter implements Core.Middleware {
    constructor(private middleware: RequestHandler) { }
    async execute(request: Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return new MiddlewareActionResult(this.middleware, async (req, res) => {
            let actionResult = await next.proceed();
            await actionResult.execute!(req, res)
        })
    }
}