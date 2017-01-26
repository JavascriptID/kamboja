import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer"

export type MethodConventionType = "getByPage" | "get" | "add" | "modify" | "delete"

export class ApiConventionTransformer extends TransformerBase {
    private conventions: Array<MethodConventionType> = ["getByPage", "get", "add", "modify", "delete"]
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.VisitResult {
        if (prevResult) {
            return this.next(prevResult);
        }
        if (this.conventions.some(x => x == meta.name)) {
            if (meta.parameters.length < 1) {
                return this.next([Core.RouteAnalysisCode.ConventionFail]);
            }
            switch (<MethodConventionType>meta.name) {
                case "getByPage":
                    return this.getByPage(meta, parent);
                case "get":
                    return this.singleParam(meta, parent, "GET");
                case "delete":
                    return this.singleParam(meta, parent, "DELETE");
                case "modify":
                    return this.singleParam(meta, parent, "PUT");
                case "add":
                    return this.add(meta, parent);
            }
        }
        return this.next()
    }


    private getByPage(meta: Kecubung.MethodMetaData, parent: string) {
        parent += "/page";
        meta.parameters.forEach(x => parent += `/:${x.name}`)
        return this.exit([{
            httpMethod: "GET",
            generatingMethod: "ApiConvention",
            parameters: meta.parameters.map(x => x.name),
            methodName: meta.name,
            route: parent
        }]);
    }


    private singleParam(meta: Kecubung.MethodMetaData, parent: string, method: Core.HttpMethod) {
        parent += "/:" + meta.parameters[0].name;
        return this.exit([{
            httpMethod: method,
            generatingMethod: "ApiConvention",
            parameters: meta.parameters.map(x => x.name),
            methodName: meta.name,
            route: parent
        }]);
    }

    private add(meta: Kecubung.MethodMetaData, parent: string) {
        return this.exit([{
            httpMethod: "POST",
            generatingMethod: "ApiConvention",
            parameters: meta.parameters.map(x => x.name),
            methodName: meta.name,
            route: parent
        }]);
    }
}