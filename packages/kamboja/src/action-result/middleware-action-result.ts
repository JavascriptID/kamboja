import { Core } from "kamboja-foundation"
import { RequestHandler } from "express"
import { ResponseAdapter } from "../response-adapter"
import { RequestAdapter } from "../request-adapter"

export class MiddlewareActionResult extends Core.ActionResult {
    /**
     * Action result adapter for express middleware 
     * @param middleware Express middleware
     * @param chain Next action result will be executed, important when used inside request interceptor
     */
    constructor(private middleware: RequestHandler, private chain?: (req: RequestAdapter, res: ResponseAdapter) => Promise<void>) {
        super(null)
        this.engine = "Express"
    }

    execute(request: RequestAdapter, response: ResponseAdapter, routeInfo: Core.RouteInfo) {
        return new Promise<void>((resolve, reject) => {
            this.middleware(request.request, response.nativeResponse, (er) => {
                request.update(request.request)
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