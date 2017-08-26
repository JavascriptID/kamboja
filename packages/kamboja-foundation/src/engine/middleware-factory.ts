import { Middleware, MiddlewaresType, DependencyResolver } from "kamboja-core";
import {CallbackMiddleware} from "../framework"

export namespace MiddlewareFactory{
    export function resolve(middlewares: MiddlewaresType[], resolver: DependencyResolver) {
        let result: Middleware[] = []
        if (!middlewares) return result;
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
            else if (typeof middleware == "function"){
                result.push(new CallbackMiddleware(middleware))
            }
            else {
                result.push(middleware)
            }
        }
        return result;
    }
}
