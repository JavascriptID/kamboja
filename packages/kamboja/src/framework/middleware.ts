import { Invocation } from "./invocation";
import { KambojaOption } from "./kamboja-option";
import { ActionResult } from "./action-result";
import {
    DecoratorHelper, 
    MiddlewareIdMetadataKey, 
    MiddlewareMetadataKey
} from "../decorator"
import {
    Handshake,
    HttpRequest,
    DependencyResolver
} from "../interfaces";


export abstract class Middleware {
    abstract execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult>;
}

export function getMiddlewares(target: any, methodName?: string) {
    return DecoratorHelper.get<(Middleware | string)>(MiddlewareMetadataKey, target, methodName)
}

export function resolve(middlewares: (string | Middleware)[], resolver: DependencyResolver) {
    let result: Middleware[] = []
    if(!middlewares) return result;
    for (let middleware of middlewares) {
        if (typeof middleware == "string") {
            try {
                let instance = resolver.resolve<Middleware>(middleware)
                result.push(instance)
            }
            catch (e) {
                throw new Error(`Can not instantiate middleware [${middleware}] in global middlewares`)
            }
        }
        else {
            result.push(middleware)
        }
    }
    return result;
}

export function getId(target: any) {
    let result = DecoratorHelper.get<string>(MiddlewareIdMetadataKey, target)
    return result ? result[0] : undefined
}