import {middleware, HttpStatusError, Middleware, Request} from "../../../src"
import * as Core from "kamboja-core"

export class Return400Middleware implements Middleware{
    execute(request: Request, next:Core.Invocation):Promise<Core.ActionResult>{
        throw new HttpStatusError(400)
    }
}