import { Validator } from "../validator";
import { BaseController } from "./base-controller";
import {
    Handshake,
    HttpRequest,
    RouteInfo,
    DependencyResolver
} from "../interfaces";

export class Controller implements BaseController {
    context: HttpRequest | Handshake
    validator: Validator
}

export function resolve(routeInfo: RouteInfo, resolver: DependencyResolver) {
    try {
        return resolver.resolve<BaseController>(routeInfo.classId)
    }
    catch (e) {
        throw new Error(`Can not instantiate [${routeInfo.classId}] as Controller.\n\t Inner message: ${e.message}`)
    }
}