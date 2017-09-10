import { Facade, Middleware, Invocation, RouteInfo, MiddlewaresType } from "kamboja-core"
import { AttachableInvocation, MiddlewareInvocation } from "./invocation"
import { MiddlewareFactory, ControllerFactory } from "./factory";
import { MiddlewareDecorator } from "../framework"

export class MiddlewarePipeline {
    private head: AttachableInvocation;
    private tail: Invocation;

    constructor(public facade: Facade, public controllerInfo?: RouteInfo) {
        let rawGlobalMiddleware = (facade.middlewares || []).slice().reverse()
        let middlewares = MiddlewareFactory.resolve(rawGlobalMiddleware, facade.dependencyResolver!)
        if (controllerInfo) {
            let controller = ControllerFactory.resolve(controllerInfo, facade.dependencyResolver!)
            middlewares.push(...MiddlewareFactory.resolve(MiddlewareDecorator
                .getMiddlewares(controller), facade.dependencyResolver!))
            middlewares.push(...MiddlewareFactory.resolve(MiddlewareDecorator
                .getMiddlewares(controller, controllerInfo.methodMetaData!.name), facade.dependencyResolver!))
        }
        middlewares.forEach(x => this.tail = new MiddlewareInvocation(x, this.tail))
    }

    execute(invocation: Invocation) {
        this.head.attach(invocation)
        return this.tail.proceed()
    }
}