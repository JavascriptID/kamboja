import * as Core from "kamboja-core"
import { ErrorInvocation, ControllerInvocation, AttachableInvocation, MiddlewareInvocation } from "./invocation"
import { MiddlewareFactory, ControllerFactory } from "./factory";
import { Invocation } from "kamboja-core";
import { MiddlewareDecorator } from "../framework";
import { ParameterBinder } from "../binder/index";

export class RequestHandler {
    private head: AttachableInvocation;
    private tail: Invocation;

    constructor(public facade: Core.Facade, public controllerInfo?: Core.RouteInfo) {
        let middlewares = <Core.Middleware[]>(facade.middlewares || []).slice().reverse()
        if (controllerInfo) {
            let controller = ControllerFactory.resolve(controllerInfo, facade.dependencyResolver!)
            middlewares.push(...MiddlewareFactory.resolve(MiddlewareDecorator
                .getMiddlewares(controller), facade.dependencyResolver!))
            middlewares.push(...MiddlewareFactory.resolve(MiddlewareDecorator
                .getMiddlewares(controller, controllerInfo.methodMetaData!.name), facade.dependencyResolver!))
        }
        this.tail = this.head = new AttachableInvocation(middlewares, controllerInfo!, facade)
        middlewares.forEach(x => {
            let invocation = new MiddlewareInvocation(x, this.tail)
            invocation.middlewares = middlewares;
            invocation.controllerInfo = controllerInfo;
            invocation.facade = facade;
            this.tail = invocation;
        })
    }

    execute(context: Core.HttpRequest | Core.Handshake, response: Core.Response, invocation: Core.Invocation) {
        return Promise.resolve()
            .then(result => this.prepare(context, invocation))
            .then(result => this.tail.proceed())
            .then(result => {
                if (context.contextType == "Handshake" && result.engine != "General")
                    throw new Error(`ActionResult Error, only return value of type 'redirect' and 'emit' are allowed in real time action`)
                return result.execute(context, response, invocation.controllerInfo)
            })
            .catch(e => {
                response.send(new Core.ActionResult(e.message, e.status || 500))
            })
    }

    private prepare(context: Core.HttpRequest | Core.Handshake, invocation: Invocation) {
        this.head.attach(invocation);
        if (context.contextType == "HttpRequest" && this.controllerInfo) {
            let binder = new ParameterBinder(this.controllerInfo!, this.facade.pathResolver!);
            this.tail.parameters = binder.getParameters(context);
        }
        else if (context.contextType == "Handshake") {
            this.tail.parameters = [context.getPacket()];
        }
        this.tail.context = context;
    }
}