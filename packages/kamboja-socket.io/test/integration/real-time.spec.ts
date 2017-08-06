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


describe("SocketController", () => {
    let app: Http.Server
    const HOST = "http://localhost:5000"
    before(done => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
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
        await SocketClient(HOST, { query: { token: "abcd" } })
            .wait(() => SocketClient(HOST)
                .on("presence")
                .expect({ id: "abcd" }))
            .connect()
    })

    it("Should able to broadcast event", async () => {
        let listeners = Promise.all([
            SocketClient(HOST)
                .on("message")
                .expect("Success!"),
            SocketClient(HOST)
                .on("message")
                .expect("Success!")
        ])
        await SocketClient(HOST)
            .wait(listeners)
            .emit("chat/broadcast")
    })
})