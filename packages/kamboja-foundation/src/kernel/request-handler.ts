import * as Core from "kamboja-core"
import { ControllerInvocation, MiddlewareInvocation } from "./invocation"
import { MiddlewareFactory, ControllerFactory } from "./factory";
import { Invocation } from "kamboja-core";
import { MiddlewareDecorator } from "../framework";
import { ParameterBinder } from "../binder/index";

export class RequestHandler {
    private head: Invocation;
    private tail: Invocation;

    constructor(public facade: Core.Facade, invocation:Invocation) {
        let middlewares = <Core.Middleware[]>(facade.middlewares || []).slice().reverse()
        if (invocation instanceof ControllerInvocation) {
            let controller = ControllerFactory.resolve(invocation.controllerInfo, facade.dependencyResolver!)
            middlewares.push(...MiddlewareFactory.resolveArray(MiddlewareDecorator
                .getMiddlewares(controller), facade.dependencyResolver!))
            middlewares.push(...MiddlewareFactory.resolveArray(MiddlewareDecorator
                .getMiddlewares(controller, invocation.controllerInfo.methodMetaData!.name), facade.dependencyResolver!))
        }
        invocation.facade = facade;
        invocation.middlewares = middlewares
        this.tail = this.head = invocation
        middlewares.forEach(x => {
            this.tail = new MiddlewareInvocation(x, this.tail, middlewares, facade, invocation.controllerInfo)
        })
    }

    execute(context: Core.HttpRequest | Core.Handshake, response: Core.Response, err?: Error) {
        return new Promise<void>(resolve => resolve(this.prepare(context, err)))
            .then(result => this.tail.proceed())
            .then(result => {
                if (context.contextType == "Handshake" && result.engine != "General")
                    throw new Error(`ActionResult Error, only return value of type 'redirect' and 'emit' are allowed in real time action`)
                return result.execute(context, response, this.tail.controllerInfo)
            })
            .catch(e => {
                response.send(new Core.ActionResult(e.message, e.status || 500))
            })
    }

    private prepare(context: Core.HttpRequest | Core.Handshake, err?: Error) {
        if(err){
            this.tail.parameters = [err]
        }
        else if (context.contextType == "HttpRequest" && this.head.controllerInfo && this.head.controllerInfo.methodMetaData!.parameters.length > 0) {
            let binder = new ParameterBinder(this.head.controllerInfo!, this.facade.pathResolver!);
            this.tail.parameters = binder.getParameters(context);
        }
        else if (context.contextType == "Handshake") {
            this.tail.parameters = [context.getPacket()];
        }
        this.tail.context = context;
    }
}