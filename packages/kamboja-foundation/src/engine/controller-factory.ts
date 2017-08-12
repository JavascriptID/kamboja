import { RouteInfo, DependencyResolver, BaseController } from "kamboja-core";

export namespace ControllerFactory{
    export function resolve(routeInfo: RouteInfo, resolver: DependencyResolver) {
        try {
            return resolver.resolve<BaseController>(routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${routeInfo.classId}] as Controller.\n\t Inner message: ${e.message}`)
        }
    }
}
