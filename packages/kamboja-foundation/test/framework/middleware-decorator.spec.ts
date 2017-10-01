import { middleware, MiddlewareDecorator, Middleware } from "../../src"
import * as Chai from "chai"
import * as Core from "kamboja-core"

@middleware.use("Interceptor, interceptor/path")
@middleware.use("SecondInterceptor, interceptor/path")
class MyTargetClass {
    @middleware.use("MethodInterceptor, interceptor/path")
    @middleware.use("SecondMethodInterceptor, interceptor/path")
    theMethod() { }

    @middleware.use("MethodInterceptor, interceptor/path")
    myProperty:string;
}

@middleware.id("kamboja:my-middleware")
class MyMiddleware extends Middleware {
    execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return next.proceed()
    }
}

class MyMiddlewareWithoutID extends Middleware {
    execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return next.proceed()
    }
}


describe("Middleware Decorator", () => {
    it("Should get class interceptors", () => {
        let target = new MyTargetClass();
        let result = MiddlewareDecorator.getMiddlewares(target);
        Chai.expect(result[0]).eq("SecondInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("Interceptor, interceptor/path")
    })

    it("Should get method interceptors", () => {
        let target = new MyTargetClass();
        let result = MiddlewareDecorator.getMiddlewares(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })

    it("Should return empty array if provided null target", () => {
        let target = new MyTargetClass();
        let result = MiddlewareDecorator.getMiddlewares(null, "theMethod");
        Chai.expect(result.length).eq(0)
    })

    it("Should throw exception if used in property", () => {
        let target = new MyTargetClass();
        let result = MiddlewareDecorator.getMiddlewares(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })

    it("Should able to get id of middleware", () => {
        let target = new MyMiddleware();
        let result = MiddlewareDecorator.getId(target);
        Chai.expect(result).eq("kamboja:my-middleware")
    })

    it("Should not error when no id found", () => {
        let target = new MyMiddlewareWithoutID();
        let result = MiddlewareDecorator.getId(target);
        Chai.expect(result).undefined
    })
})