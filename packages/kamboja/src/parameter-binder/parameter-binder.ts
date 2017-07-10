import * as Core from "kamboja-core"
import { BinderBase, BinderResult } from "./binder-base"
import { ApiConventionBinder } from "./api-convention-binder"
import { DecoratorBinder } from "./decorator-binder"
import { DefaultBinder } from "./default-binder"
import { ValTypeBinder } from "./val-type-binder"

export class ParameterBinder  {
    private commands: BinderBase[] = []
    constructor(private routeInfo: Core.RouteInfo, private pathResolver:Core.PathResolver) {
        //priorities
        this.commands = [
            new DecoratorBinder(),
            new ApiConventionBinder(),
            new ValTypeBinder(this.pathResolver),
            new DefaultBinder()
        ]
    }

    getParameters(context:any): Array<any> {
        if (!this.routeInfo.methodMetaData!.parameters
            || this.routeInfo.methodMetaData!.parameters.length == 0)
            return []
        let result:any[] = []
        for (let par of this.routeInfo.methodMetaData!.parameters) {
            result.push(this.bind(par.name, context))
        }
        return result
    }

    private bind(parameterName: string, request:any) {
        for (let cmd of this.commands) {
            let result = cmd.bind(this.routeInfo, parameterName, request)
            if (result.type == "Exit") return result.value;
        }
    }
}
