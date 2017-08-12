import { ActionResult } from "./action-result";
import { RouteInfo } from "../router";
import { Middleware } from "./middleware";

export interface Invocation {
    proceed(): Promise<ActionResult>
    parameters: any[]
    controllerInfo?: RouteInfo
    middlewares?: Middleware[]
}
