import * as Core from "../src/core"
import { Transformer } from "../src/transformer"
import { JsParser } from "./helper"
import * as Chai from "chai"
import * as Fs from "fs"
import * as Path from "path"
import * as Babylon from "babylon"
import * as Util from "util"

describe("Transformer", () => {

    describe("Real test", () => {
        it("Should transform TypeScript generated file properly", () => {
            let filename = "./dummy/dummy.js"
            let code = Fs.readFileSync(Path.join(__dirname, filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let result = dummy.transform(ast);
            //console.log(Util.inspect(result.children, false, null))
            Chai.expect(Path.resolve(result.name)).eq(Path.resolve(filename))
            Chai.expect((<Core.ParentMetaData>result.children[0]).children[0].name).eq("MyBaseClass")
            Chai.expect((<Core.ParentMetaData>result.children[0]).children[1].name).eq("MyClass")
        })

        /*
        it("Should transform TypeScript (5+ MB) without error", function () {
            this.timeout(10000)
            let filename = "./node_modules/typescript/lib/typescript.js"
            let code = Fs.readFileSync(Path.join(process.cwd(), filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let start = new Date()
            let result = dummy.transform(ast);
            let end = new Date();
            let gap = end.getTime() - start.getTime();
            console.log("EXEC TIME: " + gap)
            //Chai.expect(gap).lessThan(1000)
        })*/

        it("Should transform ES6 class with namespaces properly", () => {
            let ast = JsParser.getAst(`
                var Module;
                (function (Module) {
                    class MyClass {
                        myMethod() { }
                    }
                    Module.MyClass = MyClass;
                })(Module || (Module = {}));
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
                exports.MyClass = MyClass;
            `, true)
            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Module',
                    analysis: 66,
                    children:
                    [{
                        type: 'Class',
                        name: 'MyClass',
                        baseClass: undefined,
                        location: { start: 86, end: 162 },
                        analysis: 31,
                        methods:
                        [{
                            type: 'Method',
                            name: 'myMethod',
                            analysis: 1,
                            location: { start: 126, end: 140 },
                            parameters: [],
                        }]
                    }],
                    location: { start: 45, end: 253 },
                    name: 'Module'
                },
                {
                    type: 'Class',
                    name: 'MyClass',
                    baseClass: 'MyClass',
                    location: { start: 270, end: 412 },
                    analysis: 31,
                    methods:
                    [{
                        type: 'Method',
                        name: 'myMethod',
                        analysis: 1,
                        location: { start: 380, end: 394 },
                        parameters: [],
                    }],
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'constructor',
                        analysis: 1,
                        location: { start: 329, end: 359 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 341, end: 345 }
                        }],
                    }
                }],
                location: { start: 0, end: 468 }
            })
        })

        it("Should transform ES6 class with decorator properly", () => {
            let ast = JsParser.getAst(`
            let CategoryProductController = class CategoryProductController extends kamboja_1.ApiController {
                constructor() {
                    super(...arguments);
                }
                get(id, categoryId) { }
            };
            CategoryProductController = __decorate([
                kamboja_1.http.root("/categories/:categoryId/products")
            ], CategoryProductController);
            exports.CategoryProductController = CategoryProductController;
            `, true)

            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Class',
                    name: 'CategoryProductController',
                    baseClass: 'ApiController',
                    location: { start: 13, end: 256 },
                    analysis: 31,
                    methods:
                    [{
                        type: 'Method',
                        name: 'get',
                        analysis: 1,
                        location: { start: 218, end: 241 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'id',
                            analysis: 1,
                            location: { start: 222, end: 224 }
                        },
                        {
                            type: 'Parameter',
                            name: 'categoryId',
                            analysis: 1,
                            location: { start: 226, end: 236 }
                        }],
                    }],
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'constructor',
                        analysis: 1,
                        location: { start: 127, end: 201 },
                        parameters: [],
                    },
                    decorators:
                    [{
                        type: 'Decorator',
                        name: 'root',
                        analysis: 1,
                        location: { start: 326, end: 381 },
                        parameters: [{ type: 'String', value: '/categories/:categoryId/products' }]
                    }]
                }],
                location: { start: 0, end: 512 }
            })
        })

        it("Should transform ES6 class with default parameter", () => {
            let ast = JsParser.getAst(`
                class MyClass {
                    constructor(par1, par2 = 300){}
                    myMethod(par1, par2 = 50) { }
                }
                exports.MyClass = MyClass;
            `, true)
            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Class',
                    name: 'MyClass',
                    baseClass: undefined,
                    location: { start: 17, end: 152 },
                    analysis: 31,
                    methods:
                    [{
                        type: 'Method',
                        name: 'myMethod',
                        analysis: 1,
                        location: { start: 105, end: 134 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 114, end: 118 }
                        },
                        {
                            type: 'Parameter',
                            name: 'par2',
                            analysis: 1,
                            location: { start: 120, end: 129 }
                        }],
                    }],
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'constructor',
                        analysis: 1,
                        location: { start: 53, end: 84 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 65, end: 69 }
                        },
                        {
                            type: 'Parameter',
                            name: 'par2',
                            analysis: 1,
                            location: { start: 71, end: 81 }
                        }],
                    }
                }],
                location: { start: 0, end: 208 }
            })
        })

        it("Should transform TypeScript decorator prior to 2.4", () => {
            let ast = JsParser.getAst(`
                var MyModule;
                (function (MyModule) {
                    var MyBaseClass = (function () {
                        function MyBaseClass() {
                        }
                        MyBaseClass.prototype.baseMethod = function (par1) { };
                        return MyBaseClass;
                    }());
                    MyModule.MyBaseClass = MyBaseClass;
                    var MyClass = (function (_super) {
                        tslib_1.__extends(MyClass, _super);
                        function MyClass() {
                            return _super.call(this) || this;
                        }
                        MyClass.prototype.myMethod = function (par1) { };
                        return MyClass;
                    }(MyBaseClass));
                    tslib_1.__decorate([
                        decoOne(),
                        tslib_1.__param(0, decoOne())
                    ], MyClass.prototype, "myMethod", null);
                    MyClass = tslib_1.__decorate([
                        decoTwo("halo")
                    ], MyClass);
                    MyModule.MyClass = MyClass;
                })(MyModule = exports.MyModule || (exports.MyModule = {}));
            `, true)
            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Module',
                    analysis: 83,
                    children:
                    [{
                        type: 'Class',
                        name: 'MyBaseClass',
                        baseClass: null,
                        location: { start: 90, end: 347 },
                        analysis: 31,
                        constructor:
                        {
                            type: 'Constructor',
                            name: 'MyBaseClass',
                            analysis: 1,
                            location: { start: 147, end: 197 },
                            parameters: []
                        },
                        methods:
                        [{
                            type: 'Method',
                            name: 'baseMethod',
                            analysis: 1,
                            location: { start: 222, end: 277 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'par1',
                                analysis: 1,
                                location: { start: 267, end: 271 }
                            }]
                        }]
                    },
                    {
                        type: 'Class',
                        name: 'MyClass',
                        baseClass: 'MyBaseClass',
                        location: { start: 424, end: 802 },
                        analysis: 31,
                        constructor:
                        {
                            type: 'Constructor',
                            name: 'MyClass',
                            analysis: 1,
                            location: { start: 543, end: 651 },
                            parameters: []
                        },
                        methods:
                        [{
                            type: 'Method',
                            name: 'myMethod',
                            analysis: 1,
                            location: { start: 676, end: 725 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'par1',
                                analysis: 1,
                                location: { start: 715, end: 719 },
                                decorators:
                                [{
                                    type: 'Decorator',
                                    name: 'decoOne',
                                    analysis: 1,
                                    location: { start: 903, end: 932 },
                                    parameters: []
                                }]
                            }],
                            decorators:
                            [{
                                type: 'Decorator',
                                name: 'decoOne',
                                analysis: 1,
                                location: { start: 868, end: 877 },
                                parameters: []
                            }]
                        }],
                        decorators:
                        [{
                            type: 'Decorator',
                            name: 'decoTwo',
                            analysis: 1,
                            location: { start: 1069, end: 1084 },
                            parameters: [{ type: 'String', value: 'halo' }]
                        }]
                    }],
                    location: { start: 47, end: 1241 },
                    name: 'MyModule'
                }],
                location: { start: 0, end: 1254 }
            })
        })

        it("Should transform TypeScript decorator 2.4", () => {
            let ast = JsParser.getAst(`
                var MyModule;
                (function (MyModule) {
                    var MyBaseClass = (function () {
                        function MyBaseClass() {
                        }
                        MyBaseClass.prototype.baseMethod = function (par1) { };
                        return MyBaseClass;
                    }());
                    MyModule.MyBaseClass = MyBaseClass;
                    var MyClass = (function (_super) {
                        tslib_1.__extends(MyClass, _super);
                        function MyClass() {
                            return _super.call(this) || this;
                        }
                        MyClass.prototype.myMethod = function (par1) { };
                        tslib_1.__decorate([
                            decoOne(),
                            tslib_1.__param(0, decoOne())
                        ], MyClass.prototype, "myMethod", null);
                        MyClass = tslib_1.__decorate([
                            decoTwo("halo")
                        ], MyClass);
                        return MyClass;
                    }(MyBaseClass));
                    MyModule.MyClass = MyClass;
                })(MyModule = exports.MyModule || (exports.MyModule = {}));
            `, true)
            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Module',
                    analysis: 83,
                    children:
                    [{
                        type: 'Class',
                        name: 'MyBaseClass',
                        baseClass: null,
                        location: { start: 90, end: 347 },
                        analysis: 31,
                        constructor:
                        {
                            type: 'Constructor',
                            name: 'MyBaseClass',
                            analysis: 1,
                            location: { start: 147, end: 197 },
                            parameters: []
                        },
                        methods:
                        [{
                            type: 'Method',
                            name: 'baseMethod',
                            analysis: 1,
                            location: { start: 222, end: 277 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'par1',
                                analysis: 1,
                                location: { start: 267, end: 271 }
                            }]
                        }]
                    },
                    {
                        type: 'Class',
                        name: 'MyClass',
                        baseClass: 'MyBaseClass',
                        location: { start: 424, end: 1145 },
                        analysis: 31,
                        constructor:
                        {
                            type: 'Constructor',
                            name: 'MyClass',
                            analysis: 1,
                            location: { start: 543, end: 651 },
                            parameters: []
                        },
                        methods:
                        [{
                            type: 'Method',
                            name: 'myMethod',
                            analysis: 1,
                            location: { start: 676, end: 725 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'par1',
                                analysis: 1,
                                location: { start: 715, end: 719 },
                                decorators:
                                [{
                                    type: 'Decorator',
                                    name: 'decoOne',
                                    analysis: 1,
                                    location: { start: 838, end: 867 },
                                    parameters: []
                                }]
                            }],
                            decorators:
                            [{
                                type: 'Decorator',
                                name: 'decoOne',
                                analysis: 1,
                                location: { start: 799, end: 808 },
                                parameters: []
                            }]
                        }],
                        decorators:
                        [{
                            type: 'Decorator',
                            name: 'decoTwo',
                            analysis: 1,
                            location: { start: 1016, end: 1031 },
                            parameters: [{ type: 'String', value: 'halo' }]
                        }]
                    }],
                    location: { start: 47, end: 1269 },
                    name: 'MyModule'
                }],
                location: { start: 0, end: 1282 }
            })
        })
    })
})