export { ApiController } from "./api-controller"
export { Controller } from "./controller"
export { HttpStatusError } from "./errors"
import { RouteInfo, BaseController, DependencyResolver } from "kamboja-core"

export namespace Controllers {
    export function resolve(routeInfo: RouteInfo, resolver: DependencyResolver) {
        try {
            return resolver.resolve<BaseController>(routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${routeInfo.classId}] as Controller.\n\t Inner message: ${e.message}`)
        }
    }
}
