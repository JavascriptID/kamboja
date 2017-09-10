import * as Core from "kamboja-core"
import { ErrorInvocation, ControllerInvocation } from "./invocation"
import { MiddlewarePipeline } from "./middleware-pipeline"

export class RequestHandler {
    constructor(private pipeline: MiddlewarePipeline) { }

    async execute(context: Core.HttpRequest | Core.Handshake, response: Core.Response, invocation?: Core.Invocation) {
        try {
            if(!invocation){
                let inv  = new ControllerInvocation()
                inv.controllerInfo = this.pipeline.controllerInfo;
                inv.facade = this.pipeline.facade;
                invocation = inv
            }
            invocation.context = context;
            let result = await this.pipeline.execute(invocation)
            await result.execute(context, response, invocation.controllerInfo)
        }
        catch (e) {
            response.send(new Core.ActionResult(e.message, e.status || 500))
        }
    }
}