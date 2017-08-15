import { authorize } from "../../src"
import * as Chai from "chai"

describe("authorize", () => {
    it("Should instantiate properly", () => {
        let result = authorize()
        result();
        Chai.expect(result).not.null
    })
})