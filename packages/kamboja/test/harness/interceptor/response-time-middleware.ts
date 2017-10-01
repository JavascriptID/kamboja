import {Middleware, Request, Invocation} from "../../../src"

export class ResponseTimeMiddleware implements Middleware{
    async execute(request: Request, next: Invocation){
        console.time()
        let result = await next.proceed();
        console.timeEnd()
        return result;
    }
}