import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { getRouteDetail } from "../helper"

export class EventWithQueryParameters implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.QueryParameterNotAllowed)) {
            let routeParams = route.route!.split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))
            return [{
                code: RouteAnalysisCode.QueryParameterNotAllowed,
                type: "Error",
                message: `Query parameters in @route.on() is not allowed in ${getRouteDetail(route)}`
            }]
        }
    }
}