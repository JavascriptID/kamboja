import * as Analyzer from "../analyzers"
import * as Core from "../core"
import { TsChildDecoratorTransformer } from "./ts-child-decorator"

export class TsDecorator extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node:any, parent: Core.ParentMetaData | Core.ClassMetaData) {
        let analyzer = <Analyzer.DecoratorAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Decorator, node)
        let clazz:Core.ClassMetaData;
        if(parent.type == "Class") clazz = parent;
        else if(!parent.children) return;
        else
            clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == analyzer.getClassName())[0]
        if (analyzer.isMethodDecorator()) {
            this.transformMethod(node, clazz, analyzer)
        }
        if(analyzer.isPropertyDecorator()){
            this.transformProperty(node, clazz, analyzer)
        }
        else if (analyzer.isClassDecorator()) {
            this.transformClass(node, clazz, analyzer)
        }
    }

    private transformProperty(node:any, clazz: Core.ClassMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        let methodName = analyzer.getMethodName();
        if (clazz) {
            //property is special, because it only appears only on run time,
            //so here we add it manually
            let property:Core.PropertyMetaData = {
                type: "Property",
                name: analyzer.getMethodName(), 
                analysis: Core.AnalysisType.Valid,
                decorators: [],
                location: {
                    end: 0, start: 0
                }
            }
            if(!clazz.properties) clazz.properties = []
            clazz.properties.push(property)
            this.traverse(analyzer.getChildren(), property, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }

    private transformMethod(node:any, clazz: Core.ClassMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        let methodName = analyzer.getMethodName();
        if (clazz && clazz.methods) {
            let method = clazz.methods.filter(x => x.name == methodName)[0]
            this.traverse(analyzer.getChildren(), method, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }

    private transformClass(node:any, clazz: Core.ClassMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        if (clazz) {
            this.traverse(analyzer.getChildren(), clazz, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }
}