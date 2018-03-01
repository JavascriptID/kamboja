import {Middleware, HttpRequest, Invocation} from "../../../src"

export class ResponseTimeMiddleware implements Middleware{
    async execute(request: HttpRequest, next: Invocation){
        console.time()
        let result = await next.proceed();
        console.timeEnd()
        return result;
    }
}