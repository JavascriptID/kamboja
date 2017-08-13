import {Core} from "kamboja-foundation"

export class ResponseTimeMiddleware implements Core.Middleware{
    async execute(request: Core.HttpRequest, next: Core.Invocation){
        console.time()
        let result = await next.proceed();
        console.timeEnd()
        return result;
    }
}