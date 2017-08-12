import * as Core from "kamboja-core"
import { ControllerFactory } from "./controller-factory"
import { ValidatorImpl } from "../validator";
import { ParameterBinder } from "../parameter-binder"
import { ActionResultBase } from "../framework"

function createController(option: Core.Facade, controllerInfo: Core.ControllerInfo, parameters: any[]) {
    let validator = new ValidatorImpl(option.metaDataStorage!, <Core.ValidatorCommand[]>option.validators!)
    validator.setValue(parameters, controllerInfo.classMetaData!, controllerInfo.methodMetaData!.name)
    let controller = ControllerFactory.resolve(controllerInfo, option.dependencyResolver!)
    controller.validator = validator;
    return controller;
}

export abstract class InvocationBase {
    abstract proceed(): Promise<Core.ActionResult>
    parameters: any[]
    controllerInfo?: Core.RouteInfo
    middlewares?: Core.Middleware[]
}

export class MiddlewareInvocation extends InvocationBase {
    constructor(private invocation: Core.Invocation, private context: Core.HttpRequest | Core.Handshake, private middleware: Core.Middleware) {
        super()
        this.controllerInfo = invocation.controllerInfo
        this.middlewares = invocation.middlewares
    }

    async proceed(): Promise<Core.ActionResult> {
        return this.middleware.execute(this.context, this.invocation)
    }
}


export class ErrorInvocation extends InvocationBase {
    constructor(private error: any) { super() }

    async proceed(): Promise<Core.ActionResult> {
        throw this.error
    }
}

export class HttpControllerInvocation extends InvocationBase {

    constructor(private option: Core.Facade, private request: Core.HttpRequest, public controllerInfo: Core.ControllerInfo) { super() }

    proceed(): Promise<Core.ActionResult> {
        let binder = new ParameterBinder(this.controllerInfo, this.option.pathResolver!)
        let parameters = binder.getParameters(this.request);
        let controller = createController(this.option, this.controllerInfo, parameters)
        controller.context = this.request
        let method = (<any>controller)[this.controllerInfo.methodMetaData!.name]
        let result;
        if (this.option.autoValidation && !controller.validator.isValid())
            result = new ActionResultBase(controller.validator.getValidationErrors(), 400, "application/json")
        else
            result = method.apply(controller, parameters);
        return this.createResult(result)
    }

    private async createResult(result: any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof ActionResultBase)
            return awaitedResult
        if (this.controllerInfo.classMetaData!.baseClass == "ApiController") {
            return new ActionResultBase(awaitedResult, 200, "application/json")
        }
        return new ActionResultBase(awaitedResult, 200, "text/html")
    }
}

export class SocketControllerInvocation extends InvocationBase {

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
            result = new ActionResultBase(controller.validator.getValidationErrors(), 400)
        else
            result = method.apply(controller, [this.msg]);
        return this.createResult(result)
    }

    private async createResult(result: any) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof ActionResultBase)
            return awaitedResult;
        return new ActionResultBase(result, 200)
    }
}