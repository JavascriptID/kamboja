import { Controller, middleware, Core } from "../../../src"

@middleware.id("DefaultInterceptor")
export class DefaultInterceptor implements Core.Middleware{
    async execute(request:Core.HttpRequest, invocation:Core.Invocation) {
        return invocation.proceed()
    }
}