import * as Chai from "chai"
import {reflect} from "../src/index"


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
        for(let i in obj){
            console.log(i)
        }
        let props = reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
    })

    it("Should reflect ES6 class properly", () => {
        let obj = new Es6Class();
        obj.myProperty = "Hello"
        let props = reflect(obj)
        Chai.expect(props.some(x => x == "myProperty")).true
        Chai.expect(props.some(x => x == "myMethod")).true
        Chai.expect(props.length).eq(2)
    })
})