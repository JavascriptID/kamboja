import {Core} from "kamboja"

export class RealTimeMiddleware implements Core.Middleware {
    constructor(private socket:Core.Socket, private socketResponse:Core.Response){}
    async execute(context: Core.Socket | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        if(context.contextType == "HttpRequest"){
            let result = await next.proceed();
            if(result.events && result.events.length > 0)
                result.execute(this.socket, this.socketResponse)
            return result
        }
        else return next.proceed()
    }
}