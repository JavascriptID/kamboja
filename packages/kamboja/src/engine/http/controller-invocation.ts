import * as Core from "kamboja-core"
import { Validator, Controllers } from "../../"
import { ParameterBinder } from "../../parameter-binder"

export class ControllerInvocation extends Core.Invocation {

    constructor(private option: Core.Facade, private request: Core.HttpRequest, public controllerInfo: Core.ControllerInfo) { super() }

    proceed(): Promise<Core.ActionResult> {
        let binder: Core.ParameterBinder = new ParameterBinder(this.controllerInfo, this.option.pathResolver!)
        let parameters = binder.getParameters(this.request);
        let controller = this.createController(this.request, parameters)
        let method = controller[this.controllerInfo.methodMetaData!.name]
        let result;
        if (this.option.autoValidation && !controller.validator.isValid())
            result = new Core.HttpActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        else
            result = method.apply(controller, parameters);
        return this.createResult(result)
    }

    private async createResult(result: any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof Core.HttpActionResult)
            return awaitedResult
        if (this.controllerInfo.classMetaData!.baseClass == "ApiController") {
            return new Core.HttpActionResult(awaitedResult, 200, "application/json")
        }
        else return new Core.HttpActionResult(awaitedResult, 200, "text/html")
    }

    private createController(context: Core.HttpRequest, parameters: any[]) {
        let validator = new Validator.ValidatorImpl(this.option.metaDataStorage!, <Core.ValidatorCommand[]>this.option.validators!)
        validator.setValue(parameters, this.controllerInfo.classMetaData!, this.controllerInfo.methodMetaData!.name)
        let controller = Controllers.resolve(this.controllerInfo, this.option.dependencyResolver!)
        controller.validator = validator;
        controller.request = context;
        return controller;
    }
}