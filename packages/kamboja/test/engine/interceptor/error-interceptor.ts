import { Controller } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ErrorInterceptor implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation): Promise<Core.HttpActionResult> {
        throw new Error("ERROR INSIDE INTERCEPTOR")
    }
}