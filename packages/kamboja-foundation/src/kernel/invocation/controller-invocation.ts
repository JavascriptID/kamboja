import * as Core from "kamboja-core"
import { ParameterBinder } from "../../binder"
import { ValidatorImpl } from "../../validator"
import { ControllerFactory } from "../factory"


export class ControllerInvocation extends Core.Invocation {

    constructor(public controllerInfo: Core.RouteInfo) { super() }

    proceed(): Promise<Core.ActionResult> {
        return new Promise<Core.ActionResult>((resolve, reject) => {
            let controller = ControllerFactory.resolve(this.controllerInfo!, this.facade.dependencyResolver!)
            if (this.context.contextType == "HttpRequest")
                controller.request = this.context
            else
                controller.handshake = this.context
            controller.invocation = this
            let method: Function = (<any>controller)[this.controllerInfo!.methodMetaData!.name]
            if (this.facade.autoValidation && this.controllerInfo!.methodMetaData!.parameters.length > 0 && !controller.validator.isValid())
                resolve(new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json"))
            else {
                let result = method.apply(controller, this.parameters);
                Promise.resolve(result)
                    .then(x => {
                        if (x instanceof Core.ActionResult)
                            return x
                        if (this.controllerInfo!.classMetaData!.baseClass == "ApiController") {
                            return new Core.ActionResult(x, undefined, "application/json")
                        }
                        return new Core.ActionResult(x)
                    })
                    .then(resolve)
                    .catch(reject)
            }
        })
    }
}
