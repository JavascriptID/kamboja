import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "kamboja-core"
import { RequestHandler, ControllerInvocation, ErrorInvocation, NotFoundInvocation } from "../../src/kernel"
import { ConcatInterceptor } from "./controller/interception-order-controller"
import { DefaultPathResolver } from "../../src/resolver"
import { HttpStatusError, Router, Kamboja } from "../../src"
import { ErrorHandlerMiddleware } from "./interceptor/error-handler"
import { DefaultInterceptor } from "./interceptor/default-interceptor"
import { ChangeToHello } from "./interceptor/change-to-hello"
import { ErrorInterceptor } from "./interceptor/error-interceptor"
import { CustomValidation } from "./validator/custom-validator"
import * as Test from "kamboja-testing"


describe("RequestHandler", () => {
    let request: Test.Stub<Core.HttpRequest>
    let response: Test.Spy<Core.Response>
    let facade: Core.Facade

    beforeEach(() => {
        request = Test.stub(new Test.HttpRequest())
        response = Test.spy(new Test.HttpResponse())
        facade = H.createFacade(__dirname);
        (<any>Kamboja).facade = facade;
    })

    describe("General Functions", () => {
        it("Should handle 404 properly", async () => {
            let executor = new RequestHandler(facade, new NotFoundInvocation())
            await executor.execute(request, response)
            let result = response.MOCKS.send.getCall(0).args[0].status
            let text = response.MOCKS.send.getCall(0).args[0].body
            Chai.expect(result).eq(404)
            Chai.expect(text).eq("Requested url not found")
        })

        it("Should allow global interceptor work with request without controller", async () => {
            facade.middlewares = [
                new ChangeToHello()
            ]
            let executor = new RequestHandler(facade, new NotFoundInvocation())
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Hello world!")
        })
    })

    describe("ApiController Functions", () => {
        it("Should execute get(id) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "get")
            request.MOCKS.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))

            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq(12345)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].type).eq("application/json")
        })

        it("Should execute list(iOffset, iLimit) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "list")
            request.MOCKS.getParam.withArgs("iOffset").returns("1")
            request.MOCKS.getParam.withArgs("iLimit").returns("10")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].type).eq("application/json")
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                iOffset: 1,
                iLimit: 10
            })
        })

        it("Should execute add(data) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "add")

            request.body = {
                message: "HELLO!"
            }
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].type).eq("application/json")
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                message: "HELLO!"
            })
        })

        it("Should execute replace(id, data) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "replace")
            request.body = {
                message: "HELLO!"
            }
            request.MOCKS.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                id: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute modify(id, data) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "modify")
            request.body = {
                message: "HELLO!"
            }
            request.MOCKS.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                id: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute delete(id) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "delete")
            request.MOCKS.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq(12345)
        })

        it("Should execute get(id, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "get")
            request.MOCKS.getParam.withArgs("id").returns("12345")
            request.MOCKS.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                id: 12345, root: 12345
            })
        })

        it("Should execute list(iOffset, iLimit, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "list")
            request.MOCKS.getParam.withArgs("iOffset").returns("1")
            request.MOCKS.getParam.withArgs("iLimit").returns("10")
            request.MOCKS.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                iOffset: 1,
                iLimit: 10,
                root: 12345
            })
        })

        it("Should execute add(data, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "add")
            request.body = {
                message: "HELLO!"
            }
            request.MOCKS.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                root: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute replace(id, data, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "replace")
            request.body = {
                message: "HELLO!"
            }
            request.MOCKS.getParam.withArgs("id").returns("12345")
            request.MOCKS.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                id: 12345,
                root: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute modify(id, data, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "modify")
            request.body = {
                message: "HELLO!"
            }
            request.MOCKS.getParam.withArgs("id").returns("12345")
            request.MOCKS.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                id: 12345,
                root: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute delete(id, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "delete")
            request.MOCKS.getParam.withArgs("id").returns("12345")
            request.MOCKS.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq({
                id: 12345,
                root: 12345
            })
        })

        it("Should execute API controller properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "returnTheParam")
            request.MOCKS.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("param1")
        })

        it("Should handle return VOID type of action", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "voidMethod")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).undefined
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should not cache validator result", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "validationTest")
            request.MOCKS.getParam.withArgs("required").returns(undefined)
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq([{ field: 'required', message: '[required] is required' }])
            request.MOCKS.getParam.withArgs("required").returns(200)
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(1).args[0].body).eq("OK")
        })


        describe("Auto Required Validation", () => {
            it("Should require validate on `get` action", async () => {
                let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "get")
                request.MOCKS.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(facade, new ControllerInvocation(info))
                await executor.execute(request, response)
                Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `modify` action", async () => {
                let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "modify")
                request.body = {
                    message: "HELLO!"
                }
                request.MOCKS.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(facade, new ControllerInvocation(info))
                await executor.execute(request, response)
                Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `replace` action", async () => {
                let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "replace")
                request.body = {
                    message: "HELLO!"
                }
                request.MOCKS.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(facade, new ControllerInvocation(info))
                await executor.execute(request, response)
                Chai.expect(response.MOCKS.send.getCall(0).args[0].body).deep.eq([{ field: 'id', message: '[id] is required' }])
            })
        })
    })

    describe("Controller Functions", () => {
        it("Should set cookie to the response properly", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "setTheCookie")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].cookies).deep.eq([{ key: 'TheKey', value: 'TheValue', options: { expires: true } }])
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to send value from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnNonActionResult")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("This is dumb")
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to send promised value from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnPromisedValue")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("This is dumb")
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to send ActionResult from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnActionResult")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("/go/go/kamboja.js")
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to send promised ActionResult from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnPromisedActionResult")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("/go/go/kamboja.js")
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to send VOID from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnVoid")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).undefined
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to throw error from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwError")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Internal error")
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(500)
            Chai.expect(response.MOCKS.send.called).true
        })

        it("Should able to throw status error from controller", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwStatusError")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Not found action")
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(404)
            Chai.expect(response.MOCKS.send.called).true
        })
    })

    describe("Validation Functions", () => {

        it("Should handle validation properly", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "validationTest")
            request.MOCKS.getParam.withArgs("age").returns(undefined)
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            let result = response.MOCKS.send.getCall(0).args[0].body
            Chai.expect(result[0].field).eq("age")
            Chai.expect(result[0].message).contain("required")
        })

        it("Should not duplicate validation message on second call", async () => {
            facade.validators = [new CustomValidation]
            let info = H.getRouteInfo(facade, "controller/controller.js", "validationTest")
            request.MOCKS.getParam.withArgs("age").returns(undefined)
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            let secondHandler = new RequestHandler(facade, new ControllerInvocation(info))
            await secondHandler.execute(request, response)
            let result = response.MOCKS.send.getCall(1).args[0].body
            Chai.expect(result.length).eq(1)
            Chai.expect(result[0].field).eq("age")
            Chai.expect(result[0].message).contain("required")
        })

        it("Should not error when provided null validator commands", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "returnTheParam")
            request.MOCKS.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("param1")
        })
    })

    describe("Middleware Function", () => {
        it("Should execute global interception on all actions", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            facade.middlewares = [
                new ChangeToHello()
            ]
            //returnTheParam
            let info = infos.filter(x => x.methodMetaData!.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            request.MOCKS.getParam.withArgs("par1").returns("param1")

            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Hello world!")

            //returnTheParamWithPromise
            info = infos.filter(x => x.methodMetaData!.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            request.MOCKS.getParam.withArgs("par1").returns("param1")
            executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Hello world!")

            //voidMethod
            info = infos.filter(x => x.methodMetaData!.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Hello world!")

            //internalError
            info = infos.filter(x => x.methodMetaData!.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Hello world!")
        })

        it("Should execute interception in proper order", async () => {
            let meta = H.fromFile("controller/interception-order-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.classMetaData!.name == "InterceptedTestController" && x.methodMetaData!.name == "returnHello")[0]
            facade.middlewares = [
                new ConcatInterceptor("4"),
                new ConcatInterceptor("5")
            ]
            info.classId = info.qualifiedClassName

            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("0, 1, 2, 3, 4, 5, Hello")
        })
    })

    describe("Default Error Handler Function", () => {
        it("Should handle error from global error", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnActionResult")
            facade.routeInfos = [info]
            request.route = "/dummyapi/returnactionresult"
            let executor = new RequestHandler(facade, new ErrorInvocation())
            await executor.execute(request, response, new HttpStatusError(400))
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(400)
        })

        it("Should handle error from controller error", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwError")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(500)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Internal error")
        })

        it("Should handle error from middleware error", async () => {
            facade.middlewares = [
                new ErrorInterceptor()
            ]
            let executor = new RequestHandler(facade, new ErrorInvocation())
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(500)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("ERROR INSIDE INTERCEPTOR")
        })
    })

    describe("Error Handler Using Middleware", () => {
        it("Should able to get controllerInfo from global middleware", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnActionResult")
            facade.routeInfos = [info]
            request.route = "/dummyapi/returnview"
            facade.middlewares = [
                new ErrorHandlerMiddleware((i) => {
                    let clean = H.cleanUp([i.controllerInfo!])
                    Chai.expect(clean).deep.eq([{
                        initiator: undefined,
                        route: undefined,
                        httpMethod: undefined,
                        methodMetaData: { name: 'returnActionResult' },
                        qualifiedClassName: 'DummyApi, controller/controller.js',
                        classMetaData: { name: 'DummyApi', baseClass: 'Controller' },
                        collaborator: undefined
                    }])
                })
            ]
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response, new HttpStatusError(400))
        })

        it("Should handle error from global middleware error handler", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwError")
            facade.routeInfos = [info]
            facade.middlewares = [new ErrorHandlerMiddleware()]
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(501)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Error handled properly")
        })

        it("Should handle error from controller error", async () => {
            facade.middlewares = [
                new ErrorHandlerMiddleware()
            ]
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwError")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(501)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Error handled properly")
        })

        it("Should handle error from middleware error", async () => {
            facade.middlewares = [
                new ErrorHandlerMiddleware(),
                new ErrorInterceptor()
            ]
            let executor = new RequestHandler(facade, new NotFoundInvocation())
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(501)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Error handled properly")
        })

        it("Should handle HttpStatusError properly on controller when return non ActionResult", async () => {
            facade.middlewares = [
                new ErrorHandlerMiddleware()
            ]
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwStatusError")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(501)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Error handled properly")
        })

        it("Should handle error on multiple global middlewares", async () => {
            facade.middlewares = [
                new DefaultInterceptor(),
                new ErrorHandlerMiddleware(),
            ]
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwStatusError")
            let executor = new RequestHandler(facade, new ControllerInvocation(info))
            await executor.execute(request, response)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].status).eq(501)
            Chai.expect(response.MOCKS.send.getCall(0).args[0].body).eq("Error handled properly")
        })
    })
})