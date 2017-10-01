import { RequestHandler, Request } from "express"
import { ResponseAdapter } from "../response-adapter"
import * as Core from "kamboja-core"

export class MiddlewareActionResult extends Core.ActionResult {
    /**
     * Action result adapter for express middleware 
     * @param middleware Express middleware
     * @param chain Next action result will be executed, important when used inside request interceptor
     */
    constructor(private middleware: RequestHandler, private chain?: (req: Request, res: ResponseAdapter) => Promise<void>) {
        super(null)
        this.engine = "Express"
    }

    execute(request: Request, response: ResponseAdapter, routeInfo: Core.RouteInfo) {
        return new Promise<void>((resolve, reject) => {
            this.middleware(request, response.nativeResponse, (er) => {
                if (this.chain) {
                    if (er) return reject(er)
                    else
                        this.chain(request, response)
                            .then(resolve)
                            .catch(reject)
                }
                else {
                    response.nativeNextFunction(er)
                    resolve()
                }
            })
        })
    }
}