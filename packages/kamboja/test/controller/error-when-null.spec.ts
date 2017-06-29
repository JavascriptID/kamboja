import * as Chai from "chai"
let call = global.Error.call;
global.Error.call = function(){return undefined}
import { HttpStatusError } from "../../src/controller/errors"

/**
 * this test is a hack to get 100% coverage on extending error issue
 */
describe("HttpStatusError", () => {
    after(() => {
        global.Error.call = call;
    })
    it("Should instantiate properly when global.Error is undefined", ()=> {
        let error = new HttpStatusError(400, "Fatal Error")
        Chai.expect(error.status).eq(400)
    })
})
