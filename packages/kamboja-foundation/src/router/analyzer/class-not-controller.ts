import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"

export class ClassNotInherritedFromControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] |undefined {
        if (route.analysis 
            && route.analysis.some(x => x == RouteAnalysisCode.ClassNotInheritedFromController)
            && route.classMetaData
            && route.classMetaData.name.toLowerCase().endsWith("controller")){
            return [{
                code: RouteAnalysisCode.ClassNotInheritedFromController,
                type: "Warning",
                message: `Class not inherited from Controller, ApiController in [${route.qualifiedClassName}]`
            }]
        }
    }
}