import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { EventDecoratorTransformer } from "../../../src/route-generator/transformers/event-decorator"

describe("Event Decorator", () => {
    it("Should able to change route with @route.event()", () => {
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
            src_1.route.event("message"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new EventDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("EVENT")
        Chai.expect(result.info![0].route).eq("message")
    })

    it("Should transform multiple @route.event()", () => {
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
            src_1.route.event("message"),
            src_1.route.event("msg"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new EventDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("EVENT")
        Chai.expect(result.info![0].route).eq("message")
        Chai.expect(result.info![1].httpMethod).eq("EVENT")
        Chai.expect(result.info![1].route).eq("msg")
    })

    it("Should pass to next transformer if there is previous result", () => {
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
            src_1.route.event("message"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new EventDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <Core.RouteInfo[]>[{}])
        Chai.expect(result.status).eq("Next")
    })

    it("Should pass to next transformer if not contains @route.event()", () => {
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
            src_1.route.get("message"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new EventDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
    })

    it("Should analyze issue when route has query parameter", () => {
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
            src_1.route.event("message/:hello"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new EventDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].analysis).deep.eq([Core.RouteAnalysisCode.QueryParameterNotAllowed])
    })

    
})