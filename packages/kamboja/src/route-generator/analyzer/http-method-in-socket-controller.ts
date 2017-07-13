import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class HttpMethodInSocketController implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        if (route.httpMethod != "EVENT" && route.classMetaData!.baseClass == "SocketController")
            return [{
                code: RouteAnalysisCode.DecoratorNotAllowed,
                message: `@route.${route.httpMethod!.toLowerCase()}() is not allowed when used inside SocketController in ${getRouteDetail(route)}`,
                type: "Error"
            }]
    }
}