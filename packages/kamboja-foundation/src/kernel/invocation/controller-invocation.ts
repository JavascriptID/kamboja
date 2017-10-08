import * as Core from "kamboja-core"
import { ParameterBinder } from "../../binder"
import { ValidatorImpl } from "../../validator"
import { ControllerFactory } from "../factory"


export class ControllerInvocation extends Core.Invocation {

    constructor(public controllerInfo: Core.RouteInfo) { super() }

    proceed(): Promise<Core.ActionResult> {
        let controller = ControllerFactory.resolve(this.controllerInfo!, this.facade.dependencyResolver!)
        if (this.context.contextType == "HttpRequest")
            controller.request = this.context
        else
            controller.handshake = this.context
        controller.invocation = this
        let method = (<any>controller)[this.controllerInfo!.methodMetaData!.name]
        let result;
        if (this.facade.autoValidation && this.controllerInfo!.methodMetaData!.parameters.length > 0 && !controller.validator.isValid())
            return Promise.resolve(new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json"))
        else {
            return new Promise<Core.ActionResult>((resolve, reject) => {
                try{
                    result = method.apply(controller, this.parameters);
                    resolve(this.createResult(result))
                }
                catch(e){
                    reject(e)
                }
            })
        }
    }

    createResult(result: any) {
        return Promise.resolve(result)
            .then(awaitedResult => {
                if (awaitedResult instanceof Core.ActionResult)
                    return awaitedResult
                if (this.controllerInfo!.classMetaData!.baseClass == "ApiController") {
                    return new Core.ActionResult(awaitedResult, undefined, "application/json")
                }
                return new Core.ActionResult(awaitedResult)
            })
    }

}
