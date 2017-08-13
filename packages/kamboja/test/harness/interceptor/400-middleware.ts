import { Core } from "kamboja-foundation"
import {middleware, HttpStatusError} from "../../../src"

export class Return400Middleware implements Core.Middleware{
    execute(request:Core.HttpRequest, next:Core.Invocation):Promise<Core.ActionResult>{
        throw new HttpStatusError(400)
    }
}