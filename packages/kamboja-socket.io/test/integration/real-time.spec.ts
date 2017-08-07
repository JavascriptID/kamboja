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


describe("Real time functionalities", () => {
    let app: Http.Server
    const HOST = "http://localhost:5000"
    before(done => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .set("controllerPaths", ["real-time-controller"])
            .use(BodyParser.json())
            .use(new TokenAuthMiddleware())
            .apply(new RealTimeFacility())
            .init();

        app.listen(5000, done)
    })

    after(done => {
        app.close(done)
    })

    it("Should able listen to connection event", async () => {
        let listener = SocketClient(HOST)
            .on("join")
            .expect({ id: "abcd" });

        await SocketClient(HOST, { query: { token: "abcd" } })
            .wait(listener)
            .connect()
    })

    it("Should able to broadcast event", async () => {
        let listeners = Promise.all([
            SocketClient(HOST)
                .on("custom-event")
                .expect({ message: "Success!" }),
            SocketClient(HOST)
                .on("custom-event")
                .expect({ message: "Success!" })
        ])
        await SocketClient(HOST)
            .wait(listeners)
            .emit("send-all", "Success!")
    })

    it("Should able to send to specific user", async () => {
        let listeners = Promise.all([
            SocketClient(HOST, { query: { token: "abcd" } })
                .on("custom-event")
                .expect({ message: "Success!" }),
            SocketClient(HOST)
                .on("custom-event")
                .timeout()
        ])
        await SocketClient(HOST)
            .wait(listeners)
            .emit("send", { to: "abcd", message: "Success!" })
    })

    it("Should able to return feedback to client", async () => {
        let listeners = Promise.all([
            SocketClient(HOST, { query: { token: "abcd" } })
                .on("custom-event")
                .expect({ message: "Success!" }),
            SocketClient(HOST)
                .on("custom-event")
                .timeout()
        ])
        let feedback;
        await SocketClient(HOST)
            .wait(listeners)
            .emit("send", { to: "abcd", message: "Success!" }, msg => {
                feedback = msg;
            })
        Chai.expect(feedback).deep.eq({ body: { message: "Success!" }, status: 200 })
    })

    it.only("Should able to validate parameter", async () => {
        let listeners = Promise.all([
            SocketClient(HOST, { query: { token: "abcd" } })
                .on("custom-event")
                .timeout(),
            SocketClient(HOST)
                .on("custom-event")
                .timeout()
        ])
        let feedback;
        await SocketClient(HOST)
            .wait(listeners)
            .emit("validate", { message: "Success!" }, msg => {
                feedback = msg;
            })
        Chai.expect(feedback).deep.eq({ body: { message: "Success!" }, status: 200 })
    })

    it("Should throw error when not provide user id on emit", async () => {
        let listeners = Promise.all([
            SocketClient(HOST, { query: { token: "abcd" } })
                .on("custom-event")
                .timeout(),
            SocketClient(HOST)
                .on("custom-event")
                .timeout()
        ])
        let feedback;
        await SocketClient(HOST)
            .wait(listeners)
            .emit("send", { to: undefined, message: "Success!" }, msg => {
                feedback = msg;
            })
        Chai.expect(feedback).deep.eq({ body: "Event id can't be null on 'emit' function", status: 500 })
    })

    it("Should throw error when specify user id that is not exist", async () => {
        let listeners = Promise.all([
            SocketClient(HOST, { query: { token: "abcd" } })
                .on("custom-event")
                .timeout(),
            SocketClient(HOST)
                .on("custom-event")
                .timeout()
        ])
        let feedback;
        await SocketClient(HOST)
            .wait(listeners)
            .emit("send", { to: "def", message: "Success!" }, msg => {
                feedback = msg;
            })
        Chai.expect(feedback).deep.eq({ body: "Can't emit event to user id [def] because appropriate socket is not found", status: 500 })
    })
})