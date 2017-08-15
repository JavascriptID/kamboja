import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { getRouteDetail } from "../helper"

export class ConflictInternalDecoratorAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ConflictDecorators)) {
            return [{
                code: RouteAnalysisCode.ConflictDecorators,
                type: "Error",
                message: `Route conflict, @route.ignore() can't be combined with other type of routes in ${getRouteDetail(route)}`
            }]
        }
    }
}