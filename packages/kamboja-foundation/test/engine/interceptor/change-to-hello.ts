import { Controller, ActionResultBase, middleware, Core } from "../../../src"

@middleware.id("ChangeToHello")
export class ChangeToHello implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        return new ActionResultBase("Hello world!")
    }
}