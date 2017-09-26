import * as Core from "kamboja-core"
import { ParameterBinder } from "../../binder"
import { ValidatorImpl } from "../../validator"
import { ControllerFactory } from "../factory"


export class ControllerInvocation extends Core.Invocation {
    private error?:Error;

    constructor(public middlewares: Core.Middleware[],
        public controllerInfo: Core.RouteInfo,
        public facade: Core.Facade) { super() }

    setError(error?:Error){
        this.error = error;
    }

    proceed(): Promise<Core.ActionResult> {
        if(this.error) throw this.error;
        let controller = ControllerFactory.resolve(this.controllerInfo!, this.facade.dependencyResolver!)
        controller.context = this.context
        controller.invocation = this
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
                    return new Core.ActionResult(awaitedResult, undefined, "application/json")
                }
                return new Core.ActionResult(awaitedResult)
            })
    }
}
