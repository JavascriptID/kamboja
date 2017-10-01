import {middleware, HttpStatusError} from "../../../src"
import * as Core from "kamboja-core"

export class ConcatMiddleware implements Core.Middleware{
    constructor(public order:string){}
    async execute(request:Core.HttpRequest, next:Core.Invocation){
        let actionResult = <Core.ActionResult>await next.proceed()
        actionResult.body = this.order + " " + actionResult.body
        return actionResult;
    }
}