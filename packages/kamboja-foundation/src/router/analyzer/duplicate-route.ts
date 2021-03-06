import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { getRouteDetail } from "../helper"

export class DuplicateRouteAnalyzer implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        if(!route.route) return
        let dupe = this.routes.filter(x => x.route!.toLowerCase() == route.route!.toLowerCase() 
            && route.httpMethod == x.httpMethod);
        if (dupe.length > 0) {
            return [{
                code: RouteAnalysisCode.DuplicateRoutes,
                message: `Duplicate route [${route.route}] on: \n  ${getRouteDetail(route)} \n\  ${getRouteDetail(dupe[0])}`,
                type: "Error"
            }];
        }
        else {
            this.routes.push(route);
            return;
        }
    }
}