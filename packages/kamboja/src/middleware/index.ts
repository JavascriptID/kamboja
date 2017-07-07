import * as Core from "kamboja-core"
import { MiddlewareDecorator, MiddlewareIdMetadataKey, MiddlewareMetadataKey } from "./middleware-decorator"

export { Authorize } from "./authorize"
export { MiddlewareDecorator }

export function getMiddlewares(target: any, methodName?: string) {
    return Core.MetaDataHelper.get<(Core.Middleware | string)>(MiddlewareMetadataKey, target, methodName)
}

export function resolve(middlewares: (string | Core.Middleware)[], resolver: Core.DependencyResolver) {
    let result: Core.Middleware[] = []
    if(!middlewares) return result;
    for (let middleware of middlewares) {
        if (typeof middleware == "string") {
            try {
                let instance = resolver.resolve<Core.Middleware>(middleware)
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
    let result = Core.MetaDataHelper.get<string>(MiddlewareIdMetadataKey, target)
    return result ? result[0] : undefined
}