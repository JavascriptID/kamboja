import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import * as Core from "kamboja-core"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { ApiConventionTransformer } from "../../../src/router/transformers/api-convention"

describe("ApiConventionTransformer", () => {
    it("Should transform 'add' properly", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.add = function (body) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info![0].route).eq("/user")
    })

    it("Should transform 'get' properly", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.get = function (id) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info![0].route).eq("/user/:id")
    })

    it("Should transform 'list' properly", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.list = function (offset, limit) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info![0].route).eq("/user")
    })

    it("Should transform 'modify' properly", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.modify = function (id, body) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info![0].route).eq("/user/:id")
    })

    it("Should transform 'replace' properly", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.replace = function (id, body) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info![0].route).eq("/user/:id")
    })

    it("Should transform 'delete' properly", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.delete = function (id) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info![0].route).eq("/user/:id")
    })

    it("Should pass to next transformer if method name not [list, delete, get, modify, replace, add]", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.edit = function (id) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
    })

    it("Should pass to next transformer if previousResult was defined", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.delete = function (id) { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", <Core.RouteInfo[]>{})
        Chai.expect(result.status).eq("Next")
    })

    it("Should pass to next transformer if method doesn't have parameter", () => {
        let meta = H.fromCode(`
            var UserController = (function (_super) {
                function UserController() {
                }
                UserController.prototype.delete = function () { };
                return UserController;
            }(controller_1.ApiController));
            exports.UserController = UserController;
        `, "controller/user-controller.js")
        let test = new ApiConventionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
    })
})