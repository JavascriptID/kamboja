import { middleware } from "../../../src"
import * as Core from "kamboja-core"

@middleware.id("FirstInterceptor")
export class FirstInterceptor implements Core.Middleware{
    execute(request:Core.HttpRequest, invocation:Core.Invocation) {
        return invocation.proceed()
    }
}