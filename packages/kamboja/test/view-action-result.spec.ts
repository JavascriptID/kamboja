import * as Supertest from "supertest"
import * as Chai from "chai"
import { ViewActionResult } from "../src"
import * as Express from "express"
import * as Sinon from "sinon"
import * as BodyParser from "body-parser"
import * as Path from "path"
import { ResponseAdapter } from "../src/response-adapter"
import { convert } from "../src/request-adapter"
import * as Core from "kamboja-core"

describe("ResponseAdapter", () => {
    let app: Express.Application;
    beforeEach(() => {
        app = Express().set("views", Path.join(__dirname, "integration/view"))
            .set("view engine", "hbs")
    })

    it("Should send http preference properly", () => {
        app.use(async (req:Express.Request, resp, next) => {
            let result = new ViewActionResult({}, "user/index")
            result.cookies = [{ key: "User", value: "Nobita" }]
            result.header = { "Access-Control-Allow-Origin": "*" }
            await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.header["access-control-allow-origin"]).eq("*")
                Chai.expect(response.header["set-cookie"]).deep.eq(['User=Nobita; Path=/'])
                Chai.expect(response.text).contain("This is user/index")
            })
            .expect(200)
    })

    it("Should send body properly", () => {
        app.use(async (req:Express.Request, resp, next) => {
            let result = new ViewActionResult({}, "user/index")
            await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.text).contain("This is user/index")
            })
            .expect(200)
    })

    it("Should able to get view without specify viewName from controller without 'controller` prefix", () => {
        let routeInfo = {
            qualifiedClassName: "User, controller/user",
            methodMetaData: { name: "index" }
        }
        app.use(async (req:Express.Request, resp, next) => {
            let result = new ViewActionResult({})
            await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <Core.RouteInfo>routeInfo)
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.text).contain("This is user/index")
            })
            .expect(200)
    })

    it("Should able to get view without specify viewName", () => {
        let routeInfo = {
            qualifiedClassName: "UserController, controller/user",
            methodMetaData: { name: "index" }
        }
        app.use(async (req:Express.Request, resp, next) => {
            let result = new ViewActionResult({})
            await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <Core.RouteInfo>routeInfo)
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.text).contain("This is user/index")
            })
            .expect(200)
    })

    it("Should able to get view without specify viewName", () => {
        let routeInfo = {
            qualifiedClassName: "UserController, controller/user",
            methodMetaData: { name: "index" }
        }
        app.use(async (req:Express.Request, resp, next) => {
            let result = new ViewActionResult({}, "list")
            await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <Core.RouteInfo>routeInfo)
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.text).contain("This is user/list")
            })
            .expect(200)
    })

    it("Should throw error if access local viewName from outside controller ", () => {
        app.use(async (req:Express.Request, resp, next) => {
            try {
                let result = new ViewActionResult({}, "list")
                await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
            } catch (e) {
                resp.status(500).end(e.message)
            }
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.text).contain("Relative view path can not be use inside middlewares")
            })
            .expect(500)
    })

    it("Should throw error if not provide  viewName from outside controller ", () => {
        app.use(async (req:Express.Request, resp, next) => {
            try {
                let result = new ViewActionResult({})
                await result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
            } catch (e) {
                resp.status(500).end(e.message)
            }
        });
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.text).contain("Relative view path can not be use inside middlewares")
            })
            .expect(500)
    })

})