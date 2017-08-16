import { Facility, Core } from "../../src"
import * as Chai from "chai"

class MyFacility extends Facility {
    apply(app: Core.Application): void {
        throw new Error("Method not implemented.");
    }
}

describe("Facility", () => {
    it("Should instantiate facility properly", ()=>{
        let fac = new MyFacility();
        Chai.expect(fac).not.null;
    })
})