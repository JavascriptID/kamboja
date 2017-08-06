import * as Analyzer from "../../src/route-generator/analyzer"
import * as H from "../helper"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as Core from "kamboja-core"

describe("Analyzer", () => {
    it("Should analyze missing action parameter", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.myMethod = function () { };
                return MyClass;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.http.get("/this/is/:not/:param"),
            ], MyClass.prototype, "myMethod", null);
            exports.MyClass = MyClass;
            `, "example-file.js")
        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.MissingActionParameters,
            type: 'Warning',
            message: "Parameters [not, param] in [/this/is/:not/:param] doesn't have associated parameters in [MyClass.myMethod example-file.js]"
        }])
    })

    it("Should analyze missing route parameter", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.myMethod = function (par1) { };
                return MyClass;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.http.get("/this/is/route"),
            ], MyClass.prototype, "myMethod", null);
            exports.MyClass = MyClass;
            `, "example-file.js")
        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.MissingRouteParameters,
            type: 'Warning',
            message: "Parameters [par1] in [MyClass.myMethod example-file.js] doesn't have associated parameters in [/this/is/route]"
        }])
    })

    it("Should analyze unassociated route parameters", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.myMethod = function (par1, par2) { };
                return MyClass;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.http.get("/this/is/route/:par/:par2"),
            ], MyClass.prototype, "myMethod", null);
            exports.MyClass = MyClass;
            `, "example-file.js")
        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.UnAssociatedParameters,
            type: 'Warning',
            message: "Parameters [par1] in [MyClass.myMethod example-file.js] doesn't have associated parameters in [/this/is/route/:par/:par2]"
        }])
    })


    it("Should analyze duplicate routes", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.myMethod = function () { };
            MyClass.prototype.myOtherMethod = function () { };
            return MyClass;
        }(core_1.Controller));
        tslib_1.__decorate([
            core_1.http.get("/this/is/dupe"),
        ], MyClass.prototype, "myMethod", null);
        tslib_1.__decorate([
            core_1.http.get("/this/is/dupe"),
        ], MyClass.prototype, "myOtherMethod", null);
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DuplicateRoutes,
            message: 'Duplicate route [/this/is/dupe] on: \n  [MyClass.myOtherMethod example-file.js] \n  [MyClass.myMethod example-file.js]',
            type: 'Error'
        }])
    })

    it("Should not duplicate if different http method type ", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.myMethod = function () { };
            MyClass.prototype.myOtherMethod = function () { };
            return MyClass;
        }(core_1.Controller));
        tslib_1.__decorate([
            core_1.http.get("/this/is/dupe"),
        ], MyClass.prototype, "myMethod", null);
        tslib_1.__decorate([
            core_1.http.post("/this/is/dupe"),
        ], MyClass.prototype, "myOtherMethod", null);
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([])
    })

    it("Should analyze conflict decorators", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.myMethod = function (par1, par2) { };
            return MyClass;
        }(core_1.Controller));
        tslib_1.__decorate([
            core_1.http.get("/this/is/route/:par/:par2"),
            core_1.route.ignore(),
        ], MyClass.prototype, "myMethod", null);
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ConflictDecorators,
            message: "Route conflict, @route.ignore() can't be combined with other type of routes in [MyClass.myMethod example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze API Convention fail", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.list = function () { };
            return MyClass; 
        }(core_1.ApiController));
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ConventionFail,
            message: "Method name match API Convention but has lack of parameters in [MyClass.list example-file.js]",
            type: 'Warning'
        }])
    })

    it("Should not override existing method/property in Controller", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.context = function () { };
            MyClass.prototype.validator = function () { };
            return MyClass;
        }(core_1.Controller));
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: 1,
            type: 'Error',
            message: '[context] must not be used as action, because it will override the Controller method, in [MyClass.context example-file.js]'
        },
        {
            code: 1,
            type: 'Error',
            message: '[validator] must not be used as action, because it will override the Controller method, in [MyClass.validator example-file.js]'
        }])
    })

    it("Should not override existing method/property in ApiController", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.context = function () { };
            MyClass.prototype.validator = function () { };
            return MyClass;
        }(core_1.ApiController));
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: 1,
            type: 'Error',
            message: '[context] must not be used as action, because it will override the Controller method, in [MyClass.context example-file.js]'
        },
        {
            code: 1,
            type: 'Error',
            message: '[validator] must not be used as action, because it will override the Controller method, in [MyClass.validator example-file.js]'
        }])
    })

    it("Should analyze class not inherited from ApiController or Controller", () => {
        let meta = H.fromCode(`
        var MyClass = (function () {
            function MyClass() {
            }
            MyClass.prototype.getByPage = function () { };
            return MyClass;
        }());
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ClassNotInheritedFromController,
            message: "Class not inherited from Controller, ApiController or SocketController in [MyClass, example-file.js]",
            type: 'Warning'
        }])
    })

    it("Should analyze non exported class", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.getByPage = function () { };
            return MyClass;
        }(core_1.Controller));
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ClassNotExported,
            message: "Can not generate route because class is not exported [MyClass, example-file.js]",
            type: 'Warning'
        }])
    })

    it("Should analyze issue when @route.on() has query parameters", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.SocketController));
        tslib_1.__decorate([
            src_1.route.on("relative/:id"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.QueryParameterNotAllowed,
            message: "Query parameters in @route.event() is not allowed in [MyController.index example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze issue when @route.get() used in SocketController", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.SocketController));
        tslib_1.__decorate([
            src_1.route.get(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DecoratorNotAllowed,
            message: "@route.get() is not allowed when used inside SocketController in [MyController.index example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze issue when @route.delete() used in SocketController", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.SocketController));
        tslib_1.__decorate([
            src_1.route.delete(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DecoratorNotAllowed,
            message: "@route.delete() is not allowed when used inside SocketController in [MyController.index example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze issue when @route.post() used in SocketController", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.SocketController));
        tslib_1.__decorate([
            src_1.route.post(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DecoratorNotAllowed,
            message: "@route.post() is not allowed when used inside SocketController in [MyController.index example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze issue when @route.put() used in SocketController", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.SocketController));
        tslib_1.__decorate([
            src_1.route.put(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DecoratorNotAllowed,
            message: "@route.put() is not allowed when used inside SocketController in [MyController.index example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze issue when @route.patch() used in SocketController", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.SocketController));
        tslib_1.__decorate([
            src_1.route.patch(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DecoratorNotAllowed,
            message: "@route.patch() is not allowed when used inside SocketController in [MyController.index example-file.js]",
            type: 'Error'
        }])
    })
})