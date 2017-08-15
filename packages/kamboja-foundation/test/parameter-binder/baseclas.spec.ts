import { Binder } from "../../src"
import * as Chai from "chai"


describe("Value Converter", () => {
    it("Should convert number properly", () => {
        Chai.expect(Binder.autoConvert("123")).eq(123)
        Chai.expect(Binder.autoConvert("-123")).eq(-123)
        Chai.expect(Binder.autoConvert("0.25")).eq(0.25)
    })

    it("Should convert boolean properly", () => {
        Chai.expect(Binder.autoConvert("True")).eq(true)
        Chai.expect(Binder.autoConvert("False")).eq(false)
        Chai.expect(Binder.autoConvert("true")).eq(true)
        Chai.expect(Binder.autoConvert("false")).eq(false)
    })

    it("Should return undefined if provided undefined", () => {
        Chai.expect(Binder.autoConvert(undefined)).undefined
    })

    it("Should convert string properly", () => {
        Chai.expect(Binder.autoConvert("name123")).eq("name123")
    })
})