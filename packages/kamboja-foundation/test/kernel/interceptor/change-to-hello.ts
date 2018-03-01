import { Controller, middleware } from "../../../src"
import * as Core from "kamboja-core"

@middleware.id("ChangeToHello")
export class ChangeToHello implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        return new Core.ActionResult("Hello world!")
    }
}