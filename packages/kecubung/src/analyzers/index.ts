import {ParserType, AnalyzerType} from "./baseclasses"
import * as AsTree from "./astree"

export function get(parser:ParserType, type:AnalyzerType, node:boolean):any{
    return AsTree.get(type, node);
    /*switch(parser){
        case "ASTree":
            return AsTree.get(type, node)
        case "Acorn":
            return
    }*/
}

export {
    ParserType, 
    AnalyzerType, 
    ChildDecoratorAnalyzer, 
    ClassAnalyzer, 
    ConstructorAnalyzer, 
    DecoratorAnalyzer, 
    FileAnalyzer, 
    MethodAnalyzer, 
    ModuleAnalyzer, 
    ParameterAnalyzer,
    ValueAnalyzer,
    Es6MemberAnalyzer
} from "./baseclasses"