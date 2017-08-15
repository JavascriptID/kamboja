import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { getRouteDetail } from "../helper"

export class MissingRouteParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.MissingRouteParameters)) {
            let actionParams = route.methodMetaData!
                .parameters.map(x => x.name)
            return [{
                code: RouteAnalysisCode.MissingRouteParameters,
                type: "Warning",
                message: `Parameters [${actionParams.join(", ")}] in ${getRouteDetail(route)} doesn't have associated parameters in [${route.route}]`
            }]
        }
    }
}