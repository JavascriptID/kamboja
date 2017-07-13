import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

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
                message: `Query parameters in @route.event() is not allowed in ${getRouteDetail(route)}`
            }]
        }
    }
}