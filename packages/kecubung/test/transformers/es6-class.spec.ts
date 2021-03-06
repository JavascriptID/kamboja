import * as Core from "../../src/core"
import { Es6ClassTransformer } from "../../src/transformers/es6-class"
import { JsParser } from "../helper"
import * as Chai from "chai"
import * as Utils from "util"


describe("Es6ClassTransformer", () => {

    it("Should transform ES6 Class properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor(par1) { }
                myMethod() { }
            }
        `)
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        let test = new Es6ClassTransformer("ASTree")
        test.transform(ast, parent)
        Chai.expect(parent.children[0]).deep.eq({
            type: 'Class',
            name: 'MyClass',
            baseClass: undefined,
            location: { start: 13, end: 111 },
            analysis: Core.AnalysisType.Candidate | Core.AnalysisType.HasConstructor | Core.AnalysisType.HasMethod,
            methods:
            [{
                type: 'Method',
                name: 'myMethod',
                analysis: 1,
                location: { start: 83, end: 97 },
                parameters: [],
            }],
            constructor:
            {
                type: 'Constructor',
                name: 'constructor',
                analysis: 1,
                location: { start: 45, end: 66 },
                parameters:
                [{
                    type: 'Parameter',
                    name: 'par1',
                    analysis: 1,
                    location: { start: 57, end: 61 }
                }],
            }
        })
    })

    it("Should transform ES6 Class with declaration style properly", () => {
        let ast = JsParser.getAst(`
            let MyClass = class MyClass {
                constructor(par1) { }
                myMethod() { }
            }
        `)
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        let test = new Es6ClassTransformer("ASTree")
        test.transform(ast, parent)
        Chai.expect(parent.children[0]).deep.eq({
            type: 'Class',
            name: 'MyClass',
            baseClass: undefined,
            location: { start: 13, end: 125 },
            analysis: 14,
            methods:
            [{
                type: 'Method',
                name: 'myMethod',
                analysis: 1,
                location: { start: 97, end: 111 },
                parameters: [],
            }],
            constructor:
            {
                type: 'Constructor',
                name: 'constructor',
                analysis: 1,
                location: { start: 59, end: 80 },
                parameters:
                [{
                    type: 'Parameter',
                    name: 'par1',
                    analysis: 1,
                    location: { start: 71, end: 75 }
                }],
            }
        })
    })

    it("Should not error if provided different type node", () => {
        let ast = JsParser.getAst(`
            function MyFunction(){}
        `)
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        let test = new Es6ClassTransformer("ASTree")
        test.transform(ast, parent)
        Chai.expect(parent.children.length).eq(0)
    })

    it("Should detect if no methods defined", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor(par1) { }
            }
        `)
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        let test = new Es6ClassTransformer("ASTree")
        test.transform(ast, parent)
        Chai.expect(parent.children[0]).deep.eq({
            type: 'Class',
            name: 'MyClass',
            baseClass: undefined,
            location: { start: 13, end: 80 },
            analysis: Core.AnalysisType.Candidate | Core.AnalysisType.HasConstructor,
            methods: [],
            constructor:
            {
                type: 'Constructor',
                name: 'constructor',
                analysis: 1,
                location: { start: 45, end: 66 },
                parameters:
                [{
                    type: 'Parameter',
                    name: 'par1',
                    analysis: 1,
                    location: { start: 57, end: 61 }
                }],
            }
        })
    })
})