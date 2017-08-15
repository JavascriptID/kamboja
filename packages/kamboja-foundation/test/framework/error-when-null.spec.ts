import * as Chai from "chai"
import { HttpStatusError } from "../../src/framework"

/**
 * this test is a hack to get 100% coverage on extending error issue
 */
describe("HttpStatusError", () => {
    let call = global.Error.call;
    before(() => {
        global.Error.call = function () { return undefined }
    })
    after(() => {
        global.Error.call = call;
    })
    it("Should instantiate properly when global.Error is undefined", () => {
        let error = new HttpStatusError(400, "Fatal Error")
        Chai.expect(error.status).eq(400)
    })
})
