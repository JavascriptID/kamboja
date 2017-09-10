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
    public facade: Core.Facade

    proceed(): Promise<Core.ActionResult> {
        let binder = new ParameterBinder(this.controllerInfo!, this.facade.pathResolver!)
        let parameters = binder.getParameters(this.context);
        let controller = createController(this.facade, this.controllerInfo!, parameters)
        controller.context = this.context
        let method = (<any>controller)[this.controllerInfo!.methodMetaData!.name]
        let result;
        if (this.facade.autoValidation && !controller.validator.isValid())
            result = new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        else
            result = method.apply(controller, parameters);
        return this.createResult(result)
    }

    private async createResult(result: any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof Core.ActionResult)
            return awaitedResult
        if (this.controllerInfo!.classMetaData!.baseClass == "ApiController") {
            return new Core.ActionResult(awaitedResult, 200, "application/json")
        }
        return new Core.ActionResult(awaitedResult, 200, "text/html")
    }
}

/*

export class SocketControllerInvocation extends Core.Invocation {
    
        constructor(private option: Core.Facade,
            private socket: Core.Handshake,
            public controllerInfo: Core.ControllerInfo,
            private msg?: any) { super() }
    
        proceed(): Promise<Core.ActionResult> {
            let controller = createController(this.option, this.controllerInfo, [this.msg])
            controller.context = this.socket;
            let method = (<any>controller)[this.controllerInfo.methodMetaData!.name]
            let result;
            if (this.option.autoValidation && !controller.validator.isValid())
                result = new Core.ActionResult(controller.validator.getValidationErrors(), 400)
            else
                result = method.apply(controller, [this.msg]);
            return this.createResult(result)
        }
    
        private async createResult(result: any) {
            let awaitedResult = await Promise.resolve(result)
            if (awaitedResult instanceof Core.ActionResult)
                return awaitedResult;
            return new Core.ActionResult(result, 200)
        }
    }
    */