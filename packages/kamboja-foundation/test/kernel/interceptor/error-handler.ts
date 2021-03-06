import { HttpStatusError } from "../../../src"
import * as Core from "kamboja-core"

export class ErrorHandlerMiddleware implements Core.Middleware {
    constructor(private callback?: (i: Core.Invocation) => void) { }
    async execute(request: Core.HttpRequest, invocation: Core.Invocation) {
        try {
            return await invocation.proceed()
        } catch (e) {
            if (this.callback) this.callback(invocation)
            throw new HttpStatusError(501, "Error handled properly")
        }
    }
}