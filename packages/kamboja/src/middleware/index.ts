import * as Core from "kamboja-core"
import { MiddlewareDecorator, MiddlewareIdMetadataKey, MiddlewareMetadataKey } from "./middleware-decorator"

export { Authorize } from "./authorize"
export { MiddlewareDecorator }

export function getMiddlewares(target:any, methodName?: string) {
    return Core.MetaDataHelper.get<(Core.Middleware | string)>(MiddlewareMetadataKey, target, methodName)
}

export function getId(target:any) {
    let result = Core.MetaDataHelper.get<string>(MiddlewareIdMetadataKey, target)
    return result ? result[0] : undefined
}