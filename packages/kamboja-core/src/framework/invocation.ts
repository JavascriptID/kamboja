import { ActionResult } from "./action-result";
import { RouteInfo } from "../router";
import { Middleware } from "./middleware";
import { HttpRequest } from "../http"
import { Handshake } from "../socket"

export abstract class Invocation {
    abstract proceed(): Promise<ActionResult>
    context: HttpRequest | Handshake;
    parameters: any[]
    controllerInfo?: RouteInfo
    middlewares?: Middleware[]
}