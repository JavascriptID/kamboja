import * as Core from "kamboja-core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"
import { ControllerFactory } from "./controller-factory"

export class ControllerExecutor {
    public facade:Core.Facade
    constructor(private factory: ControllerFactory,
        private request: Core.HttpRequest) {
            this.facade = factory.facade;
    }

    async execute(parameters: any[]) {
        let controller = this.factory.createController();
        controller.validator = this.factory.createValidatorForParameters(parameters)
        controller.request = this.request;
        let method = <Function>(<any>controller)[this.factory.routeInfo.methodMetaData!.name]
        if (this.factory.routeInfo.classMetaData!.baseClass == "ApiController" &&
            this.factory.facade.autoValidation && !controller.validator.isValid()) {
            return new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        }
        return method.apply(controller, parameters);
    }
}
