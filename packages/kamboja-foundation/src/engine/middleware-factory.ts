import { Middleware, DependencyResolver } from "kamboja-core";

export namespace MiddlewareFactory{
    export function resolve(middlewares: (string | Middleware)[], resolver: DependencyResolver) {
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
            else {
                result.push(middleware)
            }
        }
        return result;
    }
}
