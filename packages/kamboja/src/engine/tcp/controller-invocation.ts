import * as Core from "kamboja-core"
import { Validator, Controllers } from "../../"
import { ParameterBinder } from "../../parameter-binder"

export class ControllerInvocation extends Core.Invocation {

    constructor(private option: Core.Facade, 
        private socket: Core.Socket, 
        public controllerInfo: Core.ControllerInfo,
        private msg:any) { super() }

    proceed(): Promise<Core.ActionResult> {
        let controller = this.createController(this.socket, this.msg)
        let method = controller[this.controllerInfo.methodMetaData!.name]
        let result;
        if (this.option.autoValidation && !controller.validator.isValid())
            result = new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        else
            result = method.apply(controller, this.msg);
        return this.createResult(result)
    }

    private async createResult(result: any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof Core.RealTimeActionResult)
            return awaitedResult;
        else
            return new Core.RealTimeActionResult(result)
    }

    private createController(context: Core.Socket, parameters: any) {
        let validator = new Validator.ValidatorImpl(this.option.metaDataStorage!, <Core.ValidatorCommand[]>this.option.validators!)
        validator.setValue(parameters, this.controllerInfo.classMetaData!, this.controllerInfo.methodMetaData!.name)
        let controller = Controllers.resolve(this.controllerInfo, this.option.dependencyResolver!)
        controller.validator = validator;
        controller.request = context;
        return controller;
    }
}