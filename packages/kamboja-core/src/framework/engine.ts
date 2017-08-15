import { RouteInfo } from "../router";
import { KambojaOption } from "./kamboja-option";

export interface Engine {
    init(routes: RouteInfo[], option: KambojaOption): any;
}