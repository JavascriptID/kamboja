import * as Chai from "chai"
import * as Core from "../src"
import * as Kecubung from "kecubung"
import { HttpRequest, HttpResponse } from "./helper"

class Invocation extends Core.Invocation{
    async proceed() {
        return new Core.ActionResult({});
    }
}

describe("Core", () => {
    it("Instantiate HttpError properly", () => {
        let httpError = new Core.HttpError(200, null, new HttpRequest(), new HttpResponse())
        Chai.expect(httpError).not.null;
    })

    it("Should instantiate HttpRequest properly", () => {
        let request = new HttpRequest();
        request.getCookie("")
        request.getHeader("")
        request.getParam("")
        request.getUserRole()
        request.getAccepts("")
        request.isAuthenticated()
    })


    it("Should instantiate HttpError properly", () => {
        let err = new Core.HttpError(200, {message:"halo"}, new HttpRequest(), new HttpResponse());
        Chai.expect(err.status).eq(200)
        Chai.expect(err.error.message).eq("halo")
    })

    it("Should instantiate Invocation properly", () => {
        let err = new Invocation()
        Chai.expect(err.proceed()).not.null;
    })

    /*
    it("Should instantiate http decorator properly", () => {
        let decorator = new Core.HttpDecorator();
        let fun = decorator.delete()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.get()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.patch()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.post()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.put()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.root("")
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
    })

    it("Should get routeinfo properly", () => {
        let result = Core.getRouteDetail({ 
            qualifiedClassName: "BookModel, model/book-model", 
            methodMetaData: <Kecubung.MethodMetaData>{ name: "getData" } 
        })
        Chai.expect(result).eq("[BookModel.getData model/book-model]")
    })*/
})
