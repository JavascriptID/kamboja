import { ControllerFactory } from "../../src/kernel"
import * as Transformer from "../../src/router/transformers"
import * as H from "../helper"
import * as Path from "path"
import * as Chai from "chai"

describe("ControllerFactory", () => {

    it("Should instantiate controller properly", () => {
        let facade = H.createFacade(__dirname)
        let meta = H.fromFile("./controller/dummy-controller.js", facade.pathResolver!)
        let info = Transformer.transform(meta)[0]
        info.classId = "DummyController, controller/dummy-controller"
        let c = ControllerFactory.resolve(info, facade.dependencyResolver!)
        Chai.expect(c).not.null
    })

    it("Should throw error when provided invalid classId", () => {
        let facade = H.createFacade(__dirname)
        let meta = H.fromFile("./controller/dummy-controller.js", facade.pathResolver!)
        let info = Transformer.transform(meta)[0]
        info.classId = "DummyController, non/valid/path"
        try {
            let c = ControllerFactory.resolve(info, facade.dependencyResolver!)
        } catch (e) {
            Chai.expect(e.message).contains("Can not instantiate [DummyController, non/valid/path] as Controller")
        }
    })
})