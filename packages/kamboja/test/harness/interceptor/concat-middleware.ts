import { middleware, HttpStatusError, Middleware, Request } from "../../../src"
import * as Core from "kamboja-core"

export class ConcatMiddleware extends Middleware {
    constructor(public order: string) { super() }
    async execute(request: Request, next: Core.Invocation) {
        let actionResult = <Core.ActionResult>await next.proceed()
        actionResult.body = this.order + " " + actionResult.body
        return actionResult;
    }
}