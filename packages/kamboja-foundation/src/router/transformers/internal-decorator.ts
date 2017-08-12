import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { TransformerBase, when } from "./transformer-base"

export class InternalDecoratorTransformer extends TransformerBase {
    private decorators: Array<Core.DecoratorType> = ["get", "put", "post", "delete", "ignore", "patch"]

    @when("Method")
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if (meta.decorators && meta.decorators.length > 0) {
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))

            //decorator conflict with internal
            if ((decorators.some(x => <Core.DecoratorType>x.name == "ignore")
                && decorators.length > 1)) {

                return this.next(<Core.RouteInfo>{
                    analysis: [Core.RouteAnalysisCode.ConflictDecorators],
                    methodMetaData: meta,
                    httpMethod: "GET",
                    initiator: "InternalDecorator"
                });
            }

            for (let decorator of meta.decorators) {
                let name = <Core.DecoratorType>decorator.name;
                if (name == "ignore") return this.exit()
            }
        }
        return this.next();
    }
}