import { Middleware, MiddlewaresType, DependencyResolver } from "kamboja-core";
import {CallbackMiddleware} from "../../framework"

export namespace MiddlewareFactory{
    export function resolveArray(middlewares: MiddlewaresType[], resolver: DependencyResolver) {
        let result: Middleware[] = []
        if (!middlewares) return result;
        for (let middleware of middlewares) {
            let mdw = resolve(middleware, resolver)
            result.push(mdw)
        }
        return result;
    }

    export function resolve(middleware:MiddlewaresType, resolver:DependencyResolver){
        if (typeof middleware == "string") {
            try {
                return resolver.resolve<Middleware>(middleware)
            }
            catch (e) {
                throw new Error(`Can not instantiate middleware [${middleware}]`)
            }
        }
        else if (typeof middleware == "function"){
            return new CallbackMiddleware(middleware)
        }
        else {
            return middleware
        }
    }
}
