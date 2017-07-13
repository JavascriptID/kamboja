import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class EventInHttpController implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        if (route.httpMethod == "EVENT" &&
            (route.classMetaData!.baseClass == "Controller" ||
                route.classMetaData!.baseClass == "ApiController"))
            return [{
                code: RouteAnalysisCode.DecoratorNotAllowed,
                message: `@route.event is not allowed when used inside ApiController or Controller in ${getRouteDetail(route)}`,
                type: "Error"
            }]
    }
}