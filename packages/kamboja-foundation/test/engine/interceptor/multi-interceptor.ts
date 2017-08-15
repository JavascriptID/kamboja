import { middleware, Core } from "../../../src"

@middleware.id("FirstInterceptor")
export class FirstInterceptor implements Core.Middleware{
    execute(request:Core.HttpRequest, invocation:Core.Invocation) {
        return invocation.proceed()
    }
}