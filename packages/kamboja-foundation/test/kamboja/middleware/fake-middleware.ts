import * as Core from "kamboja-core"

export class FakeMiddleware implements Core.Middleware {
    constructor() { }
    async execute(request: Core.HttpRequest, invocation: Core.Invocation) {
        return invocation.proceed()
    }
}