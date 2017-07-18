import { ErrorInvocation, MiddlewareInvocation } from "./invocations"
import { Middleware } from "../"
import * as Core from "kamboja-core"
import { Controllers } from "../../"

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
        let globalMiddlewares = (<Core.Middleware[]>this.option.middlewares! || []).reverse()
        if (routeInfo) {
            let controller = Controllers.resolve(routeInfo, this.option.dependencyResolver!)
            let middlewares = Middleware.resolve(Middleware.getMiddlewares(controller), this.option.dependencyResolver!)
            middlewares = globalMiddlewares.concat(middlewares)
            return middlewares.concat(Middleware.resolve(Middleware.getMiddlewares(controller, routeInfo.methodMetaData!.name), this.option.dependencyResolver!))
        }
        else {
            return globalMiddlewares;
        }
    }
}