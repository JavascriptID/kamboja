import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { TransformerBase, when } from "./transformer-base"


export class EventDecoratorTransformer extends TransformerBase {
    decorators: Core.DecoratorType[] = ["event"]

    @when("Method")
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if (prevResult) {
            //too complex to handle,
            //just pass previous result
            return this.next(prevResult);
        }
        if (meta.decorators && meta.decorators.length > 0 && meta.decorators.some(x => x.name == "event")) {
            let decorators = meta.decorators.filter(x => x.name == "event")
            let infos = decorators.map(decorator => {
                return this.createInfo(meta, decorator, parent)
            })
            return this.exit(infos)
        }
        else return this.next()
    }

    private createInfo(meta: Kecubung.MethodMetaData, decorator: Kecubung.DecoratorMetaData, parent: string) {
        let analysis: number[] = []
        let method = <Core.HttpMethod>decorator.name.toUpperCase();
        let route: string = (<Kecubung.PrimitiveValueMetaData>decorator.parameters[0]).value;
        let routeAnalysis = this.checkIfQueryParameterNotAllowed(route, method)
        if (routeAnalysis) analysis.push(routeAnalysis)
        let info = <Core.RouteInfo>{
            initiator: "HttpMethodDecorator",
            httpMethod: method,
            methodMetaData: meta,
            route: route
        };
        if (analysis.length > 0)
            info.analysis = analysis
        return info
    }

    private checkIfQueryParameterNotAllowed(route: string, method: string) {
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (routeParameters.length > 0) return Core.RouteAnalysisCode.QueryParameterNotAllowed
    }

}