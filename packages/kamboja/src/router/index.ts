export { RouteGenerator } from "./route-generator"
export { RouteAnalyzer } from "./analyzer/analyzer"
export { MethodConventionType } from "./transformers/api-convention"

import { RouteInfo } from "kamboja-core"

export function getRouteDetail(info: RouteInfo) {
    const tokens = info.qualifiedClassName!.split(",")
    const method = `${tokens[0].trim()}.${info.methodMetaData!.name}`
    const file = tokens[1].trim()
    return `[${method} ${file}]`;
}