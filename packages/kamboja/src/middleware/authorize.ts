import { Middleware, Invocation, BaseActionResult, HttpRequest } from "kamboja-core"
import { MiddlewareDecorator } from "./middleware-decorator"

let middleware = new MiddlewareDecorator()

@middleware.id("kamboja:authorize")
export class Authorize implements Middleware {
    constructor(public role: (string | string[])) { }

    execute(request: HttpRequest, invocation: Invocation):Promise<BaseActionResult> {
        return invocation.proceed()
    }
}