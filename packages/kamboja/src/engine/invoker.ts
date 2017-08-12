import { MiddlewareInvocation } from "./invocations"
import { MiddlewareDecorator, MiddlewareFactory, ControllerFactory } from "../framework"
import * as Core from "kamboja-core"

export class Invoker {
    constructor(private option: Core.Facade) { }

    invoke(context: Core.HttpRequest | Core.Handshake, controllerInvocation: Core.Invocation) {
        let invocation: Core.Invocation = controllerInvocation
        this.getMiddlewares(controllerInvocation.controllerInfo!).forEach(middleware => {
            invocation = new MiddlewareInvocation(invocation, context, middleware)
        })
        return invocation.proceed();
    }

    private getMiddlewares(routeInfo?: Core.RouteInfo) {
        let globalMiddlewares = (<Core.Middleware[]>this.option.middlewares! || []).slice().reverse()
        if (routeInfo) {
            let controller = ControllerFactory.resolve(routeInfo, this.option.dependencyResolver!)
            let middlewares = MiddlewareFactory.resolve(MiddlewareDecorator.getMiddlewares(controller), this.option.dependencyResolver!)
            middlewares = globalMiddlewares.concat(middlewares)
            return middlewares.concat(MiddlewareFactory.resolve(MiddlewareDecorator.getMiddlewares(controller, routeInfo.methodMetaData!.name), this.option.dependencyResolver!))
        }
        else {
            return globalMiddlewares;
        }
    }
}