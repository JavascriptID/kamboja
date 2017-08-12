import { Controller, ApiController, val, HttpStatusError, ActionResultBase } from "../../../src"
import {  } from "../../../src"

export function customValidation() {
    return (...args:any[]) => { }
}

export class DummyApi extends Controller {

    returnActionResult() {
        return new ActionResultBase("/go/go/kamboja.js");
    }

    returnPromisedActionResult() {
        return Promise.resolve(new ActionResultBase("/go/go/kamboja.js"));
    }

    returnPromisedValue(){
        return Promise.resolve("This is dumb")
    }

    returnNonActionResult() {
        return "This is dumb"
    }

    returnVoid(){}

    setTheCookie() {
        let result = new ActionResultBase("/go/go/kamboja.js");
        result.cookies = [{ key: "TheKey", value: "TheValue", options: { expires: true } }]
        return result;
    }

    validationTest( @val.required() age:number) {
        if (this.validator.isValid()) {
            return true
        }
        return this.validator.getValidationErrors()
    }

    customValidationTest( @customValidation() par1:any) {
        if (this.validator.isValid()) {
            return true
        }
        return this.validator.getValidationErrors()
    }

    throwError() {
        throw new Error("Internal error")
    }

    throwStatusError() {
        throw new HttpStatusError(404, "Not found action")
    }

}