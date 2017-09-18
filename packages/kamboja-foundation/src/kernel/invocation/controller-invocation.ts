import * as Core from "kamboja-core"
import { ParameterBinder } from "../../binder"
import { ValidatorImpl } from "../../validator"
import { ControllerFactory } from "../factory"

function createController(option: Core.Facade, controllerInfo: Core.ControllerInfo, parameters: any[]) {
    let validator = new ValidatorImpl(option.metaDataStorage!, <Core.ValidatorCommand[]>option.validators!)
    validator.setValue(parameters, controllerInfo.classMetaData!, controllerInfo.methodMetaData!.name)
    let controller = ControllerFactory.resolve(controllerInfo, option.dependencyResolver!)
    controller.validator = validator;
    return controller;
}

export class ControllerInvocation extends Core.Invocation {

    proceed(): Promise<Core.ActionResult> {
        let controller = createController(this.facade, this.controllerInfo!, this.parameters)
        controller.context = this.context
        let method = (<any>controller)[this.controllerInfo!.methodMetaData!.name]
        let result;
        if (this.facade.autoValidation && this.controllerInfo!.methodMetaData!.parameters.length > 0 && !controller.validator.isValid())
            result = new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        else
            result = method.apply(controller, this.parameters);
        return this.createResult(result)
    }

    createResult(result: any) {
        return Promise.resolve(result)
            .then(awaitedResult => { 
                if (awaitedResult instanceof Core.ActionResult)
                    return awaitedResult
                if (this.controllerInfo!.classMetaData!.baseClass == "ApiController") {
                    return new Core.ActionResult(awaitedResult, 200, "application/json")
                }
                return new Core.ActionResult(awaitedResult, 200, "text/html")
            })
    }
}
