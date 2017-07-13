import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { HttpDecoratorTransformer } from "../../../src/route-generator/transformers/http-decorator"

describe("Http Decorator", () => {
    it("Should pass to next transformer if provide @route.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.get(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info![0].httpMethod).eq("GET")
    })

    it("Should pass to next transformer if provide @route.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.post(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info![0].httpMethod).eq("POST")
    })

    it("Should pass to next transformer if provide @route.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.put(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info![0].httpMethod).eq("PUT")
    })

    it("Should pass to next transformer if provide @route.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.patch(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info![0].httpMethod).eq("PATCH")
    })

    it("Should pass to next transformer if provide @route.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.delete(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info![0].httpMethod).eq("DELETE")
    })

    it("Should able to change route with relative @route.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.get("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("GET")
        Chai.expect(result.info![0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @route.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.get("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("GET")
        Chai.expect(result.info![0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @route.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.post("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("POST")
        Chai.expect(result.info![0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @route.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.post("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("POST")
        Chai.expect(result.info![0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @route.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.patch("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("PATCH")
        Chai.expect(result.info![0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @route.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.patch("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("PATCH")
        Chai.expect(result.info![0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @route.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.put("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("PUT")
        Chai.expect(result.info![0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @route.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.put("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("PUT")
        Chai.expect(result.info![0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @route.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.delete("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("DELETE")
        Chai.expect(result.info![0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @route.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.route.delete("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("DELETE")
        Chai.expect(result.info![0].route).eq("/absolute/relative")
    })

    it("Should able to change route with relative @route.event()", () => {
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
            src_1.route.event("relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("EVENT")
        Chai.expect(result.info![0].route).eq("/user/relative")
    })

    it("Should able to change route with absolute @route.event()", () => {
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
            src_1.route.event("/absolute/relative"),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.info![0].httpMethod).eq("EVENT")
        Chai.expect(result.info![0].route).eq("/absolute/relative")
    })
    
    it("Should pass to next transformer if not contains decorator", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <any>undefined)
        Chai.expect(result.status).eq("Next")
    })

    it("Should pass to next transformer contains previousResult", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new HttpDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <Core.RouteInfo[]>[{}])
        Chai.expect(result.status).eq("Next")
    })
})