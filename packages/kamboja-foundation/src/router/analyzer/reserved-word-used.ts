import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand } from "./definitions"
import { ApiController, Controller } from "../../framework"
import { getRouteDetail } from "../helper"

type ControllerMemberNames = keyof Controller
type ApiControllerMemberNames = keyof ApiController

const reservedWords: ControllerMemberNames[] = [
    "context", "validator"]

const apiReservedWords: ApiControllerMemberNames[] = [
    "context", "validator"]



export class ReservedWordUsedAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] | undefined {
        let usedInController = reservedWords.some(x => route.methodMetaData!
            && x == route.methodMetaData!.name)
            && route.classMetaData!.baseClass == "Controller"
        let usedInApiController = apiReservedWords.some(x => route.methodMetaData!
            && x == route.methodMetaData!.name)
            && route.classMetaData!.baseClass == "ApiController"
        if (usedInApiController || usedInController) {
            return [{
                code: RouteAnalysisCode.UnAssociatedParameters,
                type: "Error",
                message: `[${route.methodMetaData!.name}] must not be used as action, because it will override the Controller method, in ${getRouteDetail(route)}`
            }]
        }
    }
}