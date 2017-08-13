import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { getRouteDetail } from "../helper"

export class UnassociatedParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined{
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.UnAssociatedParameters)) {
            let routeParams = route.route!.split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))
            let actionParams = route.methodMetaData!
                .parameters.map(x => x.name)
            let missing = actionParams.filter(x => !routeParams.some(y => x == y))
            if (missing.length > 0) {
                return [{
                    code: RouteAnalysisCode.UnAssociatedParameters,
                    type: "Warning",
                    message: `Parameters [${missing.join(", ")}] in ${getRouteDetail(route)} doesn't have associated parameters in [${route.route}]`
                }]
            }
        }
    }
}