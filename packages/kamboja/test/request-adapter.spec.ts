import * as Supertest from "supertest"
import * as Chai from "chai"
import { convert, Request } from "../src/request-adapter"
import * as Express from "express"
import * as Kamboja from "kamboja-foundation"
import * as Core from "kamboja-core"
import * as CookieParser from "cookie-parser"


describe("RequestAdapter", () => {
    it("Should convertible to Express request", () => {
        let res:Core.HttpRequest = <Express.Request>{};
    })

    it("Should return header properly", () => {
        let app = Express();
        app.get("/", (req:Express.Request, res) => {

            let custom = convert(req).getHeader("custom-header")
            Chai.expect(custom).eq("CUSTOM_VALUE")
            res.end();
        })
        return Supertest(app)
            .get("/")
            .set("custom-header", "CUSTOM_VALUE")
            .expect(200)
    })

    it("Should return param properly", () => {
        let app = Express();
        app.get("/", (req:Express.Request, res) => {
            let custom = convert(req).getParam("custom-param")
            Chai.expect(custom).eq("CUSTOM_VALUE")
            res.end()
        })
        return Supertest(app)
            .get("/?custom-param=CUSTOM_VALUE")
            .expect(200)
    })

    it("Should return query properly", () => {
        let app = Express();
        app.get("/:id", (req:Express.Request, res) => {
            let custom = convert(req).getParam("id")
            Chai.expect(custom).eq("2")
            res.end()
        })
        return Supertest(app)
            .get("/2")
            .expect(200)
    })

    it("Should not error when cookie-parser not installed", () => {
        let app = Express();
        app.get("/", (req:Express.Request, res) => {
            let custom = convert(req).getCookie("custom-cookie")
            Chai.expect(custom).undefined;
            res.end()
        })
        return Supertest(app)
            .get("/")
            .expect(200)
    })

    it("Should return cookie properly", async () => {
        let app = Express();
        app.use(CookieParser())
        app.get("/set-cookie", (req, res) => {
            res.cookie("custom-cookie", "CUSTOM_VALUE")
            res.end()
        })
        app.get("/", (req:Express.Request, res) => {
            let custom = convert(req).getCookie("custom-cookie")
            Chai.expect(custom).eq("CUSTOM_VALUE")
            res.end()
        })
        await Supertest(app)
            .get("/set-cookie")
            .expect(200)

        return Supertest(app)
            .get("/")
            .set("Cookie", `custom-cookie=CUSTOM_VALUE`)
            .expect(200)
    })
})