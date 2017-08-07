import * as Chai from "chai"
import * as Supertest from "supertest"
import { KambojaApplication, Core } from "kamboja-express"
import { socketTester as SocketClient } from "kamboja-testing"
import { RealTimeFacility } from "../../src/"
import * as BodyParser from "body-parser"
import * as Http from "http"

class TokenAuthMiddleware implements Core.Middleware {
    execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        let token = context.getHeader("token") || context.getParam("token")
        if (token) context.user = { id: token }
        return next.proceed()
    }
}

describe("Hybrid Real-time function", () => {
    let app: Http.Server
    const HOST = "http://localhost:5000"


    afterEach(done => {
        app.close(done)
    })

    it("Should able to broadcast event without authentication", async () => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .set("controllerPaths", ["hybrid-controller"])
            .use(BodyParser.json())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        await Promise.all([
            SocketClient(HOST).on("message").expect("Success!"),
            SocketClient(HOST).on("message").expect("Success!"),
            Supertest(HOST)
                .get("/http/broadcast")
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.body).eq("Success!")
                })
                .expect(200)
        ])
    })

    it("Should able to send event to specific client without authentication", async () => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .set("controllerPaths", ["hybrid-controller"])
            .use(BodyParser.json())
            .use(new TokenAuthMiddleware())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        await Promise.all([
            SocketClient(HOST).on("message").timeout(),
            SocketClient(HOST, { query: { token: "abc" } }).on("message").expect("Success!"),
            Supertest(HOST)
                .get("/http/private?to=abc")
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.body).eq("Success!")
                })
                .expect(200),
        ])
    })

    it("Should not conflict with http controller that doesn't emit events", async () => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .set("controllerPaths", ["hybrid-controller"])
            .use(BodyParser.json())
            .use(new TokenAuthMiddleware())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        Supertest(HOST)
            .get("/http/noEmit")
            .expect((response: Supertest.Response) => {
                Chai.expect(response.body).eq("Success!")
            })
            .expect(200)
    })

    it("Should return error when not provide user id on emit", async () => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .set("controllerPaths", ["hybrid-controller"])
            .use(BodyParser.json())
            .use(new TokenAuthMiddleware())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        await Promise.all([
            SocketClient(HOST).on("message").timeout(),
            SocketClient(HOST, { query: { token: "abc" } }).on("message").timeout(),
            Supertest(HOST)
                .get("/http/private")
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.text).eq("Event id can't be null on 'emit' function")
                })
                .expect(500),
        ])
    })

    it("Should return error when not provide correct user id on emit", async () => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .set("controllerPaths", ["hybrid-controller"])
            .use(BodyParser.json())
            .use(new TokenAuthMiddleware())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        await Promise.all([
            SocketClient(HOST).on("message").timeout(),
            SocketClient(HOST, { query: { token: "abc" } }).on("message").timeout(),
            Supertest(HOST)
                .get("/http/private?to=cde")
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.text).eq("Can't emit event to user id [cde] because appropriate socket is not found")
                })
                .expect(500),
        ])
    })
})