import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class ClassNotInherritedFromControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] |undefined {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotInheritedFromController)) {
            return [{
                code: RouteAnalysisCode.ClassNotInheritedFromController,
                type: "Warning",
                message: `Class not inherited from Controller, ApiController or SocketController in [${route.qualifiedClassName}]`
            }]
        }
    }
}