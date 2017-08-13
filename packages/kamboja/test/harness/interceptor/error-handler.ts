import { Core, Middleware } from "kamboja-foundation"
import {middleware, view} from "../../../src"

export class ErrorHandler extends Middleware{
    constructor(private callback?:(i:Core.Invocation) => void){ super()}

    async execute(request:Core.HttpRequest, next:Core.Invocation):Promise<Core.ActionResult>{
        try{
            return await next.proceed()
        }
        catch(e){
            if(this.callback) this.callback(next)
            return view({}, "_shared/error")
        }
    }
}