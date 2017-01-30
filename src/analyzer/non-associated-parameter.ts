import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class UnassociatedParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.UnAssociatedParameters)) {
            let routeParams = route.route.split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))
            let actionParams = route.methodMetaData
                .parameters.map(x => x.name)
            let missing = actionParams.filter(x => !routeParams.some(y => x == y))
            if (missing.length > 0) {
                let message = `Parameters [${missing.join(", ")}] in ${getMethodName(route)} doesn't have associated parameters in [${route.route}]`;
                return [{
                    type: "Warning",
                    message: message
                }]
            }
        }
    }
}