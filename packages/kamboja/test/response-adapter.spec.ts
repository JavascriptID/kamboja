import * as Supertest from "supertest"
import * as Chai from "chai"
import { ResponseAdapter } from "../src/response-adapter"
import * as Express from "express"
import * as Sinon from "sinon"
import * as BodyParser from "body-parser"
import { Core } from "kamboja-foundation"

describe("ResponseAdapter", () => {

    it("Should send body properly", () => {
        return Supertest(Express().use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)
            adapter.send(new Core.ActionResult("Halo"))
        }))
            .get("/")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.text).eq("Halo")
                Chai.expect(response.type).eq("text/html")
            })
            .expect(200)
    })

    it("Should able to send number", () => {
        return Supertest(Express().use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)
            adapter.send(new Core.ActionResult(400))
        }))
            .get("/")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.text).eq("400")
                Chai.expect(response.type).eq("text/html")
            })
            .expect(200)
    })

    it("Should able to send boolean", () => {
        return Supertest(Express().use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)

            adapter.send(new Core.ActionResult(false))
        }))
            .get("/")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.text).eq("false")
                Chai.expect(response.type).eq("text/html")
            })
            .expect(200)
    })

    it("Should send cookie properly", () => {
        return Supertest(Express().use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)
            adapter.send(new Core.ActionResult(undefined).setCookie("Key", "Value"))
        }))
            .get("/")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.header["set-cookie"]).deep.eq(['Key=Value; Path=/'])
            })
            .expect(200)
    })

    it("Should able to send header properly", () => {
        return Supertest(Express().use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)
            adapter.send(new Core.ActionResult(undefined).setHeader("Accept", "text/xml"))
        }))
            .get("/")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.header["accept"]).eq("text/xml")
            })
            .expect(200)
    })

    it("Should set status properly", () => {
        return Supertest(Express().use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)
            adapter.send(new Core.ActionResult(undefined, 401))
        }))
            .get("/")
            .expect(401)
    })

    it("Should set JSON properly", () => {
        return Supertest(Express().use(BodyParser.json()).use((req, resp, next) => {
            let adapter = new ResponseAdapter(resp, next)
            adapter.send(new Core.ActionResult({ message: "Hello" }, 200, "application/json"))
        }))
            .get("/")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.body).deep.eq({ message: "Hello" })
                Chai.expect(response.type).eq("application/json")
            })
            .expect(200)
    })
})