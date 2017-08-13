import * as Chai from "chai"
import {Decorator} from "../src"


class Es6Class {
    myProperty:string
    myMethod(){
        console.log("Hello")
    }
}

describe("reflect", () => {

    it("Should reflect object properly", () => {
        let obj = {
            myProperty: "Hello",
            myMethod: () => {}
        }
        let props = Decorator.reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
    })

    it("Should reflect ES6 class properly", () => {
        let obj = new Es6Class();
        obj.myProperty = "Hello"
        let props = Decorator.reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
        Chai.expect(props.length).eq(2)
    })
})