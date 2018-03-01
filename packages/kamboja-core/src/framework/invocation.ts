import { ActionResult } from "./action-result";
import { RouteInfo } from "../router";
import { Middleware } from "./middleware";
import { HttpRequest } from "../http"
import { Handshake } from "../socket"
import { Facade } from "../index"
import { InvocationBase } from "./invocation-base"

export abstract class Invocation implements InvocationBase{
    abstract proceed(): Promise<ActionResult>
    context: HttpRequest | Handshake;
    parameters: any[]
    controllerInfo?: RouteInfo
    middlewares?: Middleware[]
    facade: Facade
}