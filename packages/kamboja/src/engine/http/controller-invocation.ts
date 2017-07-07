import * as Core from "kamboja-core"
import { Validator, Controllers } from "../../"
import { ParameterBinder } from "../../parameter-binder"


export class ControllerInvocation extends Core.Invocation {

    constructor(private option: Core.Facade, private routeInfo:Core.RouteInfo) { super() }

    proceed(): Promise<Core.ActionResult> {
        let binder: Core.ParameterBinder = new ParameterBinder(this.routeInfo, this.option.pathResolver!)
        let validator = new Validator.ValidatorImpl(this.option.metaDataStorage!, <Core.ValidatorCommand[]>this.option.validators!)
        let parameters = binder.getParameters(context);
        let methodName = this.routeInfo.methodMetaData!.name;
        validator.setValue(parameters, this.routeInfo.classMetaData!, methodName)
        let controller = Controllers.resolve(this.routeInfo, this.option.dependencyResolver!)
        controller.validator = validator;
        controller.context = context;
        let method = <Function>(<any>controller)[methodName]
        let result: any = {}
        if (this.option.autoValidation && !controller.validator.isValid()) {
            result = new Core.HttpActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        }
        result = method.apply(controller, this.parameters);
        return this.createResult(result)
    }

    async createResult(result:any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof Core.HttpActionResult)
            return awaitedResult
        if(this.routeInfo.classMetaData!.baseClass == "ApiController"){
            return new Core.HttpActionResult(awaitedResult, 200, "application/json")
        }
        else return new Core.HttpActionResult(awaitedResult, 200, "text/html")
    }
}