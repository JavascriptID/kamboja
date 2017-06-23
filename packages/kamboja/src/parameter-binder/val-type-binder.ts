import { RouteInfo, HttpRequest, PathResolver } from "kamboja-core"
import { BinderBase, BinderResult } from "./binder-base"
import { convert } from "./value-converter"
import { DecoratorMetaData, PrimitiveValueMetaData } from "kecubung"
import { QualifiedName } from "../resolver"

export class ValTypeBinder extends BinderBase {
    constructor(private pathResolver:PathResolver){
        super()
    }

    bind(routeInfo: RouteInfo, parameterName: string, request: HttpRequest): BinderResult {
        if (routeInfo.methodMetaData!.parameters.some(x => x.decorators != undefined
            && x.decorators.some(d => d.name == "body"))) return this.next()

        let decorators = routeInfo.methodMetaData!
            .parameters.filter(x => x.name == parameterName)[0].decorators;
        if (decorators == undefined || decorators.length == 0 || !decorators.some(x => x.name == "type")) return this.next()

        let typeDecorator = <PrimitiveValueMetaData>decorators.filter(x => x.name == "type")[0].parameters[0]
        if(!new QualifiedName(typeDecorator.value, this.pathResolver).isValid()) return this.next()
        return this.exit(request.body)
    }
}