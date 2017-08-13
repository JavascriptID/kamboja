import { RouteInfo, AnalysisMessage } from "kamboja-core"

export interface AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined;
}
