import { Controller, middleware } from "../../../src"
import * as Core from "kamboja-core"

@middleware.id("DefaultInterceptor")
export class DefaultInterceptor implements Core.Middleware{
    async execute(request:Core.HttpRequest, invocation:Core.Invocation) {
        return invocation.proceed()
    }
}