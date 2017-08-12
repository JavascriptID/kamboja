import { RouteInfo, AnalysisMessage } from "kamboja-core"
import { getRouteDetail } from "../../router"


export interface AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined;
}

export { getRouteDetail }