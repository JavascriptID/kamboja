import { TransformStatus } from "./definition";
import { RouteInfo } from "./route-info";

export interface TransformResult {
    status: TransformStatus
    info?: RouteInfo[]
}