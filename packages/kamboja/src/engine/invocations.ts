import * as Core from "kamboja-core"
import { Validator, Controllers } from "../../"
import { ParameterBinder } from "../parameter-binder"

function createController(option: Core.Facade, controllerInfo: Core.ControllerInfo, parameters: any[]) {
    let validator = new Validator.ValidatorImpl(option.metaDataStorage!, <Core.ValidatorCommand[]>option.validators!)
    validator.setValue(parameters, controllerInfo.classMetaData!, controllerInfo.methodMetaData!.name)
    let controller = Controllers.resolve(controllerInfo, option.dependencyResolver!)
    controller.validator = validator;
    return controller;
}

export class MiddlewareInvocation extends Core.Invocation {
    constructor(private invocation: Core.Invocation, private context: Core.HttpRequest | Core.Handshake, private middleware: Core.Middleware) {
        super()
        this.controllerInfo = invocation.controllerInfo
        this.middlewares = invocation.middlewares
    }

    async proceed(): Promise<Core.ActionResult> {
        return this.middleware.execute(this.context, this.invocation)
    }
}


export class ErrorInvocation extends Core.Invocation {
    constructor(private error: any) { super() }

    async proceed(): Promise<Core.ActionResult> {
        throw this.error
    }
}

export class HttpControllerInvocation extends Core.Invocation {

    constructor(private option: Core.Facade, private request: Core.HttpRequest, public controllerInfo: Core.ControllerInfo) { super() }

    proceed(): Promise<Core.ActionResult> {
        let binder = new ParameterBinder(this.controllerInfo, this.option.pathResolver!)
        let parameters = binder.getParameters(this.request);
        let controller = <any>createController(this.option, this.controllerInfo, parameters)
        controller.request = this.request
        let method = controller[this.controllerInfo.methodMetaData!.name]
        let result;
        if (this.option.autoValidation && !controller.validator.isValid())
            result = new Core.ActionResult(controller.validator.getValidationErrors(), 400, "application/json")
        else
            result = method.apply(controller, parameters);
        return this.createResult(result)
    }

    private async createResult(result: any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof Core.ActionResult)
            return awaitedResult
        if (this.controllerInfo.classMetaData!.baseClass == "ApiController") {
            return new Core.ActionResult(awaitedResult, 200, "application/json")
        }
        return new Core.ActionResult(awaitedResult, 200, "text/html")
    }
}

export class SocketControllerInvocation extends Core.Invocation {

    constructor(private option: Core.Facade,
        private socket: Core.Handshake,
        public controllerInfo: Core.ControllerInfo,
        private msg: any) { super() }

    proceed(): Promise<Core.ActionResult> {
        let controller = <any>createController(this.option, this.controllerInfo, this.msg)
        controller.socket = this.socket;
        let method = controller[this.controllerInfo.methodMetaData!.name]
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
        return new Core.ActionResult(result)
    }
}