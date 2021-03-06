import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import * as H from "../helper"
import * as Transformer from "../../src/router/transformers"
import * as Util from "util"
import * as Dash from "lodash"
import { DefaultPathResolver } from "../../src/resolver"
describe("Transformer", () => {
    describe("Default Transformation", () => {
        it("Should be able to transform Class/Method/:Parameter", () => {
            let meta = H.fromFile("./transformer-dummy/simple-controller.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'DefaultAction',
                route: '/simple/index',
                httpMethod: 'GET',
                methodMetaData: { name: 'index' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/simple-controller.js',
                classMetaData: { name: 'SimpleController', baseClass: 'Controller' },
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/mygetaction',
                httpMethod: 'GET',
                methodMetaData: { name: 'myGetAction' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/simple-controller.js',
                classMetaData: { name: 'SimpleController', baseClass: 'Controller' },
                collaborator: ['Controller']
            },
            {
                initiator: 'DefaultAction',
                route: '/simple/myactionwithoutparameter',
                httpMethod: 'GET',
                methodMetaData: { name: 'myActionWithoutParameter' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/simple-controller.js',
                classMetaData: { name: 'SimpleController', baseClass: 'Controller' },
                collaborator: ['Controller']
            }])
        })

        it("Should not transform class that not inherited from Controller", () => {
            let meta = H.fromFile("./transformer-dummy/non-controller.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean[0].analysis[0]).eq(Core.RouteAnalysisCode.ClassNotInheritedFromController)
            Chai.expect(clean[1].analysis[0]).eq(Core.RouteAnalysisCode.ClassNotInheritedFromController)
        })

        it("Should be able to transform Deep Module Module/Class/Method/:Parameter", () => {
            let meta = H.fromFile("./transformer-dummy/deep-module.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/parentmodule/simple/myothergetaction')
            Chai.expect(result[1].route).eq('/parentmodule/innermodule/simple/myactionwithoutparameter')
        })

        it("Should OK for class without 'Controller' prefix", () => {
            let meta = H.fromFile("./transformer-dummy/non-controller-name.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/controllerwithoutprefix/mygetaction')
        })

        it("Should not transform non exported class", () => {
            let meta = H.fromFile("./transformer-dummy/non-exported-class.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).undefined
            Chai.expect(result[0].analysis).deep.eq([Core.RouteAnalysisCode.ClassNotExported])
            Chai.expect(result[1].route).eq("/simple/myothergetaction")
        })

        it("Should not transform non exported on Deep Module", () => {
            let meta = H.fromFile("./transformer-dummy/non-exported-deep-module.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/parentmodule/simple/myothergetaction')
            Chai.expect(result[1].route).eq('/parentmodule/innermodule/simple/myactionwithoutparameter')
            Chai.expect(result[1].analysis).deep.eq([Core.RouteAnalysisCode.ClassNotExported])
            Chai.expect(result[2].route).undefined
            Chai.expect(result[2].analysis).deep.eq([
                Core.RouteAnalysisCode.ClassNotInheritedFromController,
                Core.RouteAnalysisCode.ClassNotExported])
        })

        it("Should give correct analysis in Deep Module", () => {
            let meta = H.fromFile("./transformer-dummy/issue-with-non-valid-module.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/this/is/the/:nonPar/route')
            Chai.expect(result[0].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters,
                Core.RouteAnalysisCode.ClassNotExported
            ])
        })
    })

    describe("Internal Decorator", () => {
        it("Should not transform @route.ignore() action", () => {
            let meta = H.fromFile("./transformer-dummy/internal-decorators.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let info = result.filter(x => x.methodMetaData!.name == "privateMethod")
            Chai.expect(info.length).eq(0);
        })

        it("Should detect conflict @route.ignore() and @route.<any>()", () => {
            let meta = H.fromFile("./transformer-dummy/internal-conflict.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(result[0].route).undefined
            Chai.expect(result[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
        })

    })

    describe("Http Decorator", () => {
        it("Should transform @route decorator", () => {
            let meta = H.fromFile("./transformer-dummy/http-decorators.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/this/get/got/different")
            Chai.expect(result[0].httpMethod).eq("GET")
            Chai.expect(result[1].route).eq("/this/post/got/different")
            Chai.expect(result[1].httpMethod).eq("POST")
            Chai.expect(result[2].route).eq("/this/put/got/different")
            Chai.expect(result[2].httpMethod).eq("PUT")
            Chai.expect(result[3].route).eq("/this/delete/got/different")
            Chai.expect(result[3].httpMethod).eq("DELETE")
            Chai.expect(result[4].route).eq("/this/patch/got/different")
            Chai.expect(result[4].httpMethod).eq("PATCH")
            Chai.expect(result[5].route).eq("this/is/event")
            Chai.expect(result[5].httpMethod).eq("EVENT")
        })

        it("Should identify parameter association issue", () => {
            let meta = H.fromFile("./transformer-dummy/http-decorator-param-issue.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/route/got/:parameter')
            Chai.expect(result[0].analysis).deep.eq([
                Core.RouteAnalysisCode.MissingActionParameters,
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[1].route).eq('/route/:associated/:notAssociated')
            Chai.expect(result[1].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[2].route).eq('/route/have/no/parameter')
            Chai.expect(result[2].analysis).deep.eq([
                Core.RouteAnalysisCode.MissingRouteParameters,
            ])
        })

        it("Should allow multiple decorators", () => {
            let meta = H.fromFile("./transformer-dummy/http-decorator-multiple.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/this/is/the/first/route')
            Chai.expect(result[0].methodMetaData!.name).eq('actionHaveNoParameter')
            Chai.expect(result[1].route).eq('/this/is/the/other/route')
            Chai.expect(result[1].methodMetaData!.name).eq('actionHaveNoParameter')
            Chai.expect(result[2].route).eq('/this/is/:parameter')
            Chai.expect(result[2].methodMetaData!.name).eq('actionWithParameter')
            Chai.expect(result[3].route).eq('/the/:parameter/in/the/middle')
            Chai.expect(result[3].methodMetaData!.name).eq('actionWithParameter')
        })

        it("Empty http decorator parameter should fall back to default action generator", () => {
            let meta = H.fromFile("./transformer-dummy/http-decorator-no-parameter.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/simple/getmethod")
            Chai.expect(result[0].httpMethod).eq("GET")
            Chai.expect(result[0].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[0].collaborator!.some(x => x == "DefaultAction")).true
            Chai.expect(result[1].route).eq("/simple/postmethod")
            Chai.expect(result[1].httpMethod).eq("POST")
            Chai.expect(result[1].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[1].collaborator!.some(x => x == "DefaultAction")).true
            Chai.expect(result[2].route).eq("/simple/putmethod")
            Chai.expect(result[2].httpMethod).eq("PUT")
            Chai.expect(result[2].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[2].collaborator!.some(x => x == "DefaultAction")).true
            Chai.expect(result[3].route).eq("/simple/deletemethod")
            Chai.expect(result[3].httpMethod).eq("DELETE")
            Chai.expect(result[3].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[3].collaborator!.some(x => x == "DefaultAction")).true
        })

        it("Should check parameters association issue on multiple decorators", () => {
            let meta = H.fromFile("./transformer-dummy/http-decorator-multiple-issue.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(result[0].route).eq("/this/is/the/first/route/:nonPar")
            Chai.expect(result[0].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[0].methodMetaData!.name).eq("actionHaveNoParameter")
            Chai.expect(result[1].route).eq("/this/is/the/:nonPar/route")
            Chai.expect(result[1].analysis).deep.eq([
                Core.RouteAnalysisCode.UnAssociatedParameters
            ])
            Chai.expect(result[1].methodMetaData!.name).eq("actionHaveNoParameter")
        })
    })

    describe("ApiConvention", () => {
        it("Should transform API Convention properly", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/simple',
                httpMethod: 'GET',
                methodMetaData: { name: 'list' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple',
                httpMethod: 'POST',
                methodMetaData: { name: 'add' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'PUT',
                methodMetaData: { name: 'replace' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'PATCH',
                methodMetaData: { name: 'modify' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            },
            {
                initiator: 'ApiConvention',
                route: '/simple/:id',
                httpMethod: 'DELETE',
                methodMetaData: { name: 'delete' },
                qualifiedClassName: 'SimpleController, ./transformer-dummy/api-convention.js',
                classMetaData: { name: 'SimpleController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            }])
        })

        it("Should identify missing parameter and give Convention Fail warning", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention-parameter-issue.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/simple/list")
            Chai.expect(result[0].httpMethod).eq("GET")
            Chai.expect(result[0].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[1].route).eq("/simple/get")
            Chai.expect(result[1].httpMethod).eq("GET")
            Chai.expect(result[1].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[2].route).eq("/simple/add")
            Chai.expect(result[2].httpMethod).eq("GET")
            Chai.expect(result[2].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[3].route).eq("/simple/modify")
            Chai.expect(result[3].httpMethod).eq("GET")
            Chai.expect(result[3].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[4].route).eq("/simple/replace")
            Chai.expect(result[4].httpMethod).eq("GET")
            Chai.expect(result[4].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
            Chai.expect(result[5].route).eq("/simple/delete")
            Chai.expect(result[5].httpMethod).eq("GET")
            Chai.expect(result[5].analysis).deep.eq([Core.RouteAnalysisCode.ConventionFail])
        })

        it("Should fall back to default transformer if name doesn't match", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention-free-name.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq('/simple/thisisfreeactionname')
            Chai.expect(result[0].initiator).eq("DefaultAction")
        })

        it("Should support @internal decorator", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention-with-internal.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let info = result.filter(x => x.methodMetaData!.name == "getByPage")
            Chai.expect(info.length).eq(0)
        })

        it("Should prioritized @route.<any> decorators", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention-with-http-decorator.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[0].route).eq("/simple/getbypage")
            Chai.expect(result[0].initiator).eq("HttpMethodDecorator")
            Chai.expect(result[0].collaborator!.some(x => x == "DefaultAction")).true
        })

        it("Should add @val.required validator on `get` action", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let hasRequired = result.filter(x => x.methodMetaData!.name == "get")
                .some(x => x.methodMetaData!.parameters[0].decorators!.some(y => y.name == "required"))
            Chai.expect(hasRequired).true
        })

        it("Should add @val.required validator on `modify` action", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let hasRequired = result.filter(x => x.methodMetaData!.name == "modify")
                .some(x => x.methodMetaData!.parameters[0].decorators!.some(y => y.name == "required"))
            Chai.expect(hasRequired).true
        })

        it("Should add @val.required validator on `replace` action", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let hasRequired = result.filter(x => x.methodMetaData!.name == "replace")
                .some(x => x.methodMetaData!.parameters[0].decorators!.some(y => y.name == "required"))
            Chai.expect(hasRequired).true
        })

        it("Should add @val.required validator on `delete` action", () => {
            let meta = H.fromFile("./transformer-dummy/api-convention.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let hasRequired = result.filter(x => x.methodMetaData!.name == "delete")
                .some(x => x.methodMetaData!.parameters[0].decorators!.some(y => y.name == "required"))
            Chai.expect(hasRequired).true
        })
    })

    describe("Root Decorator", () => {
        it("Should transform @route decorator", () => {
            let meta = H.fromFile("./transformer-dummy/root-decorator.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: '/absolute/relative',
                httpMethod: 'GET',
                methodMetaData: { name: 'index' },
                qualifiedClassName: 'Namespace.AbsoluteRootController, ./transformer-dummy/root-decorator.js',
                classMetaData: { name: 'AbsoluteRootController', baseClass: 'Controller' },
                collaborator: ['DefaultAction', 'ControllerWithDecorator', 'Module']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/abs/url',
                httpMethod: 'GET',
                methodMetaData: { name: 'myGetAction' },
                qualifiedClassName: 'Namespace.AbsoluteRootController, ./transformer-dummy/root-decorator.js',
                classMetaData: { name: 'AbsoluteRootController', baseClass: 'Controller' },
                collaborator: ['DefaultAction', 'ControllerWithDecorator', 'Module']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: 'custom-event',
                httpMethod: 'EVENT',
                methodMetaData: { name: 'customHandler' },
                qualifiedClassName: 'Namespace.AbsoluteRootController, ./transformer-dummy/root-decorator.js',
                classMetaData: { name: 'AbsoluteRootController', baseClass: 'Controller' },
                collaborator: ['ControllerWithDecorator', 'Module']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/namespace/relative/relative',
                httpMethod: 'GET',
                methodMetaData: { name: 'index' },
                qualifiedClassName: 'Namespace.RelativeRootController, ./transformer-dummy/root-decorator.js',
                classMetaData: { name: 'RelativeRootController', baseClass: 'Controller' },
                collaborator: ['DefaultAction', 'ControllerWithDecorator', 'Module']
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/absolute/url',
                httpMethod: 'GET',
                methodMetaData: { name: 'myGetAction' },
                qualifiedClassName: 'Namespace.RelativeRootController, ./transformer-dummy/root-decorator.js',
                classMetaData: { name: 'RelativeRootController', baseClass: 'Controller' },
                collaborator: ['DefaultAction', 'ControllerWithDecorator', 'Module']
            }])
        })

        it("Should identify unassociated parameter", () => {
            let meta = H.fromFile("./transformer-dummy/root-decorator-parameterized.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'HttpMethodDecorator',
                route: '/absolute/:none/relative/:no',
                httpMethod: 'GET',
                methodMetaData: { name: 'index' },
                qualifiedClassName: 'AbsoluteRootController, ./transformer-dummy/root-decorator-parameterized.js',
                classMetaData: { name: 'AbsoluteRootController', baseClass: 'Controller' },
                collaborator: ['DefaultAction', 'ControllerWithDecorator'],
                analysis: [Core.RouteAnalysisCode.UnAssociatedParameters]
            },
            {
                initiator: 'DefaultAction',
                route: '/absolute/:none/other',
                httpMethod: 'GET',
                methodMetaData: { name: 'other' },
                qualifiedClassName: 'AbsoluteRootController, ./transformer-dummy/root-decorator-parameterized.js',
                classMetaData: { name: 'AbsoluteRootController', baseClass: 'Controller' },
                collaborator: ['ControllerWithDecorator'],
                analysis: [Core.RouteAnalysisCode.UnAssociatedParameters]
            },
            {
                initiator: 'HttpMethodDecorator',
                route: '/relative/:par2/relative',
                httpMethod: 'GET',
                methodMetaData: { name: 'index' },
                qualifiedClassName: 'RelativeRootController, ./transformer-dummy/root-decorator-parameterized.js',
                classMetaData: { name: 'RelativeRootController', baseClass: 'Controller' },
                collaborator: ['DefaultAction', 'ControllerWithDecorator']
            }])
        })

        it("Should automatically add required validator on appropriate parameter", () => {
            let meta = H.fromFile("./transformer-dummy/root-decorator-parameterized.js", new DefaultPathResolver(__dirname))
            let result = Transformer.transform(meta);
            Chai.expect(result[2].methodMetaData!.parameters[1].decorators![0].name).eq("required")
        })
    })

    describe("ES6 Class Transformation", () => {
        it("Should transform ES6 class properly", () => {
            let meta = H.fromCode(`
                class UserController extends kamboja.ApiController{
                    get(id){}
                }
                exports.UserController = UserController;
            `)

            let result = Transformer.transform(meta)
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/user/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                qualifiedClassName: 'UserController, ',
                classMetaData: { name: 'UserController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            }])
        })

        it("Should transform ES6 class with decorator", () => {
            let meta = H.fromCode(`
                let UserController = class UserController extends kamboja.ApiController{
                    get(id){}
                }
                UserController = __decorate([
                    kamboja_1.http.root("/categories/:id/products")
                ], UserController);
                exports.UserController = UserController;
            `)

            let result = Transformer.transform(meta)
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/categories/:id/products/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                qualifiedClassName: 'UserController, ',
                classMetaData: { name: 'UserController', baseClass: 'ApiController' },
                collaborator: ['ControllerWithDecorator']
            }])
        })

        it("Should identify unassociated parameter", () => {
            let meta = H.fromCode(`
                let UserController = class UserController extends kamboja.ApiController{
                    get(id){}
                }
                UserController = __decorate([
                    kamboja_1.http.root("/categories/:categoryId/products")
                ], UserController);
                exports.UserController = UserController;
            `)

            let result = Transformer.transform(meta)
            Chai.expect(result[0].analysis![0]).eq(Core.RouteAnalysisCode.UnAssociatedParameters)
        })

        it("Should transform ES6 class which have method with default parameter", () => {
            let meta = H.fromCode(`
                class UserController extends kamboja.ApiController{
                    get(id=50){}
                }
                exports.UserController = UserController;
            `)

            let result = Transformer.transform(meta)
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/user/:id',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                qualifiedClassName: 'UserController, ',
                classMetaData: { name: 'UserController', baseClass: 'ApiController' },
                collaborator: ['Controller']
            }])
        })

        it("Should fall back to default transformer if has lack of parameters", () => {
            let meta = H.fromCode(`
                class UserController extends kamboja.ApiController{
                    get(){}
                }
                exports.UserController = UserController;
            `)

            let result = Transformer.transform(meta)
            let clean = H.cleanUp(result)
            Chai.expect(clean).deep.eq([{
                initiator: 'ApiConvention',
                route: '/user/get',
                httpMethod: 'GET',
                methodMetaData: { name: 'get' },
                qualifiedClassName: 'UserController, ',
                classMetaData: { name: 'UserController', baseClass: 'ApiController' },
                collaborator: ['DefaultAction', 'Controller'],
                analysis: [Core.RouteAnalysisCode.ConventionFail]
            }])
        })
    })
})