import { Controller, ApiController, } from "../../../src"
import { val, HttpStatusError, Core } from "../../../src"

export class DummyApi extends ApiController {
    returnTheParam(par1:any) {
        return par1;
    }

    returnTheParamWithPromise(par1:any) {
        return Promise.resolve(par1);
    }

    voidMethod() { }

    internalError() {
        throw new Error("Internal error from DummyApi")
    }

    returnOk() {
        return "OK!"
    }

    validationTest( @val.required() required:any) { 
        return "OK"
    }

    validationTestThrowError(@val.required() required:any){
        throw new Error("Internal error")
    }

    statusError(){
        throw new HttpStatusError(404, "Not found")
    }
}