import {middleware, HttpStatusError, Middleware, HttpRequest } from "../../../src"
import * as Core from "kamboja-core"

export class Return400Middleware implements Middleware{
    execute(request: HttpRequest, next:Core.Invocation):Promise<Core.ActionResult>{
        throw new HttpStatusError(400)
    }
}