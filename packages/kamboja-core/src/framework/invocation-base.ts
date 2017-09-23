import { RouteInfo } from "../router";
import { Middleware } from "./middleware";
import { HttpRequest } from "../http"
import { Handshake } from "../socket"
import { Facade } from "../index"

export interface InvocationBase {
    context: HttpRequest | Handshake;
    parameters: any[]
    controllerInfo?: RouteInfo
    middlewares?: Middleware[]
    facade: Facade
}