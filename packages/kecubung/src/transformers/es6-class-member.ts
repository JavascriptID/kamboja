
import * as Analyzer from "../analyzers"
import { ParameterTransformer } from "./parameter"
import { ParameterWithDefaultTransformer } from "./parameter-with-default"
import * as Core from "../core"


export class Es6ClassMember extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.ClassMethod)
    transform(node: any, parent: Core.ClassMetaData) {
        let analyser = <Analyzer.Es6MemberAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Es6ClassMember, node)
        let type = <"Method" | "Constructor">analyser.getType()
        if (analyser.isCandidate()) {
            let method = <Core.MethodMetaData | Core.ConstructorMetaData>{
                type: type,
                name: analyser.getName(),
                analysis: Core.AnalysisType.Valid,
                location: analyser.getLocation(),
                parameters: []
            }
            if (!parent.methods) parent.methods = []
            if (method.type == "Method")
                parent.methods.push(method)
            if (method.type == "Constructor")
                parent.constructor = method
            this.traverse(analyser.getParameters(), method, [
                new ParameterTransformer(this.parserType),
                new ParameterWithDefaultTransformer(this.parserType)
            ])
        }
    }
}