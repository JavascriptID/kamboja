import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { getRouteDetail } from "../helper"

export class ConventionFailDecoratorAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined{
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ConventionFail)) {
            return [{
                code: RouteAnalysisCode.ConventionFail,
                type: "Warning",
                message: `Method name match API Convention but has lack of parameters in ${getRouteDetail(route)}`
            }]
        }
    }
}