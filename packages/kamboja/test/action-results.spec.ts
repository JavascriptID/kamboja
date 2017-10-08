import * as action from "../src/action-result/action-results"
import * as Chai from "chai"
import * as Supertest from "supertest"
import * as Express from "express"
import { ResponseAdapter } from "../src/response-adapter"
import { convert } from "../src/request-adapter"
import * as Morgan from "morgan"
import * as Path from "path"

describe("ActionResults", () => {
    it("Should able to response file download", () => {
        let app = Express()
        app.use((req:Express.Request, resp, next) => {
            let result = action.download(Path.join(__dirname, "helper.js"))
            result.cookies = [{ key: "User", value: "Nobita" }]
            result.header = { "Access-Control-Allow-Origin": "*" }
            result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        })
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.header["access-control-allow-origin"]).eq("*")
                Chai.expect(response.header["set-cookie"]).deep.eq(['User=Nobita; Path=/'])
                Chai.expect(response.header["content-disposition"]).eq(`attachment; filename="helper.js"`)
            })
            .expect(200)
    })

    it("Should able to response file", () => {
        let app = Express()
        app.use((req:Express.Request, resp, next) => {
            let result = action.file(Path.join(__dirname, "helper.js"))
            result.cookies = [{ key: "User", value: "Nobita" }]
            result.header = { "Access-Control-Allow-Origin": "*" }
            result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        })
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.header["access-control-allow-origin"]).eq("*")
                Chai.expect(response.header["set-cookie"]).deep.eq(['User=Nobita; Path=/'])
                Chai.expect(response.type).eq(`application/javascript`)
            })
            .expect(200)
    })

    it("Should able to response redirect", () => {
        let app = Express()
        app.get("/user", (req, res) => {
            res.end()
        })
        app.use((req:Express.Request, resp, next) => {
            //resp.sendFile("test/helper.js")
            let result = action.redirect("/user")
            result.cookies = [{ key: "User", value: "Nobita" }]
            result.header = { "Access-Control-Allow-Origin": "*" }
            result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        })
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.header["access-control-allow-origin"]).eq("*")
                Chai.expect(response.header["set-cookie"]).deep.eq(['User=Nobita; Path=/'])
                Chai.expect(response.header["location"]).eq("/user")
            })
            .expect(302)
    })

    it("Should able to response json", () => {
        let app = Express()
        app.use((req:Express.Request, resp, next) => {
            //resp.sendFile("test/helper.js")
            let result = action.json({ message: "Hello" })
            result.cookies = [{ key: "User", value: "Nobita" }]
            result.header = { "Access-Control-Allow-Origin": "*" }
            result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        })
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.header["access-control-allow-origin"]).eq("*")
                Chai.expect(response.header["set-cookie"]).deep.eq(['User=Nobita; Path=/'])
                Chai.expect(response.body).deep.eq({ message: "Hello" })
            })
            .expect(200)
    })

    it("Should able to response json with status", () => {
        let app = Express()
        app.use((req:Express.Request, resp, next) => {
            //resp.sendFile("test/helper.js")
            let result = action.json({ message: "Hello" })
            result.status = 400
            result.header = { "Access-Control-Allow-Origin": "*" }
            result.execute(convert(req, resp), new ResponseAdapter(resp, next), <any>undefined)
        })
        return Supertest(app)
            .get("/")
            .expect((response:Supertest.Response) => {
                Chai.expect(response.body).deep.eq({ message: "Hello" })
            })
            .expect(400)
    })
})