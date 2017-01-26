import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer"


export class HttpDecoratorTransformer extends TransformerBase {
    decorators: Core.DecoratorType[] = ["get", "post", "put", "delete"]
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.VisitResult {
        if(prevResult){
            //too complex to handle,
            //just past previous result
            return this.next(prevResult);
        }
        if (meta.decorators && meta.decorators.length > 0) {
            let result: Core.RouteInfo[] = [];
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))
            //single method can be assigned with multiple route,
            //so the result is multiple RouteInfo
            for (let decorator of decorators) {
                let info = this.createInfo(meta, decorator);
                result.push(info);
            }
            //pass to the default action generator to fill the missing route (decorator without parameter)
            return this.next(result)
        }
        else return this.next()
    }

    private createInfo(meta: Kecubung.MethodMetaData, decorator: Kecubung.DecoratorMetaData) {
        let method = <Core.HttpMethod>decorator.name.toUpperCase();
        //if decorator doesn't contains parameter (url) then 
        //left the url empty and pass to the next transformer
        if (!decorator.parameters || decorator.parameters.length == 0) {
            return <Core.RouteInfo>{
                generatingMethod: "HttpMethodDecorator",
                httpMethod: method,
                methodName: meta.name,
                parameters: meta.parameters.map(x => x.name)
            };
        }
        else {
            let route = decorator.parameters[0].name;
            let analysis:number[] = []

            let routeAnalysis = this.checkMissingActionParameters(meta, route)
            if (routeAnalysis) analysis.push(routeAnalysis)

            routeAnalysis = this.checkMissingRouteParameters(meta, route, method)
            if (routeAnalysis) analysis.push(routeAnalysis)

            routeAnalysis = this.checkUnassociatedParameters(meta, route);
            if (routeAnalysis) return analysis.push(routeAnalysis)
            return <Core.RouteInfo>{
                generatingMethod: "HttpMethodDecorator",
                httpMethod: method,
                methodName: meta.name,
                route: route,
                parameters: meta.parameters.map(x => x.name),
                analysis:analysis
            };
        }

    }

    private checkMissingActionParameters(meta: Kecubung.MethodMetaData, route: string) {
        //analyse if route contains parameter but method without parameter
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (routeParameters.length > 0 && meta.parameters.length == 0) {
            return Core.RouteAnalysisCode.MissingActionParameters
        }
        return;
    }

    private checkMissingRouteParameters(meta: Kecubung.MethodMetaData, route: string, method: string) {
        //analyse if method contains parameter but route without parameter
        //this check only work for GET method, because other method can pass a BODY to the parameter
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (method == "GET" && routeParameters.length == 0 && meta.parameters.length > 0) {
            return Core.RouteAnalysisCode.MissingRouteParameters
        }
        return;
    }

    private checkUnassociatedParameters(meta: Kecubung.MethodMetaData, route: string) {
        //analyse if provided has associated parameter
        let parameters = meta.parameters.map(x => x.name);
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        for (let x of routeParameters) {
            let parName = x.substring(1);
            if (!parameters.some(y => y == parName)) {
                return Core.RouteAnalysisCode.UnAssociatedParameters
            }
        }
        return;
    }
}