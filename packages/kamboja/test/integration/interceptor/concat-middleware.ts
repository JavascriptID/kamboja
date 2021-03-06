import { middleware, HttpStatusError, Middleware, HttpRequest } from "../../../src"
import * as Core from "kamboja-core"

export class ConcatMiddleware extends Middleware {
    constructor(public order: string) { super() }
    async execute(request: HttpRequest, next: Core.Invocation) {
        let actionResult = <Core.ActionResult>await next.proceed()
        actionResult.body = this.order + " " + actionResult.body
        return actionResult;
    }
}