import { Middleware } from "kamboja-foundation"
import { RequestHandler, Request } from "express"
import * as Core from "kamboja-core"

export class ExpressMiddlewareAdapter implements Core.Middleware {
    constructor(private middleware: RequestHandler) { }
    execute(request: Request, next: Core.Invocation): Promise<Core.ActionResult> {
        return new Promise<Core.ActionResult>((resolve, reject) => {
            this.middleware(request, request.response, (e) => {
                if(e) reject(e)
                else {
                    next.proceed()
                        .then(resolve)
                        .catch(reject)
                }
            })
        })
    }
}