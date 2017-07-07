import { ErrorInvocation, MiddlewareInvocation } from "./invocations"
import { Middleware } from "../"
import * as Core from "kamboja-core"
import { Controllers } from "../../"

export class Invoker {
    constructor(private option: Core.Facade) { }

    invoke(context: any, controllerInvocation: Core.Invocation) {
        let invocation: Core.Invocation = controllerInvocation
        this.getMiddlewares(controllerInvocation.controllerInfo!).forEach(middleware => {
            invocation = new MiddlewareInvocation(invocation, context, middleware)
        })
        return invocation.proceed();
    }

    private getMiddlewares(routeInfo?: Core.RouteInfo) {
        if (routeInfo) {
            let controller = Controllers.resolve(routeInfo, this.option.dependencyResolver!)
            let middlewares = Middleware.resolve(Middleware.getMiddlewares(controller), this.option.dependencyResolver!)
            middlewares = <Core.Middleware[]>this.option.middlewares!.concat(middlewares)
            return middlewares.concat(Middleware.resolve(Middleware.getMiddlewares(controller, routeInfo.methodMetaData!.name), this.option.dependencyResolver!))
        }
        else {
            return <Core.Middleware[]>this.option.middlewares!;
        }
    }
}