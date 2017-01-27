import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"
import { ControllerTransformer } from "./controller"

export class ModuleTransformer extends TransformerBase {
    @Core.when("Module")
    transform(meta: Kecubung.ParentMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        this.installChildTransformer()
        if (!Kecubung.flag(meta.analysis, Kecubung.AnalysisType.Valid)) return this.exit();
        parent += "/" + meta.name.toLowerCase();
        let result = this.transformChildren(meta.children, parent)
        result.forEach(x => {
            if (!x.collaborator) x.collaborator = []
            x.collaborator.push("Module")
        })
        return this.exit(result)
    }

    private installChildTransformer() {
        //highest priority transformer should stay on top of another
        this.transformers = [
            new ModuleTransformer(),
            new ControllerTransformer(),
        ]
    }
}