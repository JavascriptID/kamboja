import { Core } from "kamboja-foundation"
import { middleware } from "../../../src"

@middleware.id("kamboja-express:global")
export class GlobalInterceptor implements Core.Middleware {
    async execute(request: Core.HttpRequest, next: Core.Invocation) {
        if (request.url.pathname == "/unhandled/url") {
            return new Core.ActionResult("HELLOW!!")
        }
        return next.proceed()
    }
}