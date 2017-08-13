import { ActionResult } from "./action-result";
import { RouteInfo } from "../router";
import { Middleware } from "./middleware";

export abstract class Invocation {
    abstract proceed(): Promise<ActionResult>
    parameters: any[]
    controllerInfo?: RouteInfo
    middlewares?: Middleware[]
}