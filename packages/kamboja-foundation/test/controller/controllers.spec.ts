import { Controllers } from "../../src/controller"
import * as Transformer from "../../src/route-generator/transformers"
import * as H from "../helper"
import * as Path from "path"
import * as Chai from "chai"

describe("Controllers", () => {

    it("Should instantiate controller properly", () => {
        let facade = H.createFacade(__dirname)
        let meta = H.fromFile("./controller/dummy-controller.js", facade.pathResolver!)
        let info = Transformer.transform(meta)[0]
        info.classId = "DummyController, controller/dummy-controller"
        let c = Controllers.resolve(info, facade.dependencyResolver!)
        Chai.expect(c).not.null
    })

    it("Should throw error when provided invalid classId", () => {
        let facade = H.createFacade(__dirname)
        let meta = H.fromFile("./controller/dummy-controller.js", facade.pathResolver!)
        let info = Transformer.transform(meta)[0]
        info.classId = "DummyController, non/valid/path"
        try {
            let c = Controllers.resolve(info, facade.dependencyResolver!)
        } catch (e) {
            console.log(e.message)
            Chai.expect(e.message).contains("Can not instantiate [DummyController, non/valid/path] as Controller")
        }
    })
})