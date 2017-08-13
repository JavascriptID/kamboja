import { HttpRequest, HttpResponse, spy, stub, socketTester, SocketHandshake } from "../src"
import * as Core from "kamboja-core"
import * as Chai from "chai";
import { app } from "./socket-server"

describe("Testing Utility", () => {
    it("Should provide HttpRequest properly", () => {
        let request = new HttpRequest();
        request.getCookie("")
        request.getHeader("")
        request.getParam("")
        request.getUserRole()
        request.getAccepts("")
        request.isAuthenticated()
    })

    it("Should provide HttpResponse properly", () => {
        let response = new HttpResponse();
        response.send(new Core.ActionResult(undefined))
    })

    it("Should provide stub properly", () => {
        let resp = stub(new HttpResponse());
        resp.send(new Core.ActionResult(undefined));
        Chai.expect(resp.MOCKS.send.called).true
    })

    it("Should provide spy properly", () => {
        let resp = spy(new HttpResponse());
        resp.send(new Core.ActionResult(undefined));
        Chai.expect(resp.MOCKS.send.called).true
    })

    it("Should provide handshake properly", () => {
        let handshake = new SocketHandshake();
        handshake.getHeader("")
        handshake.getParam("")
    })
})

describe("Socket tester", () => {
    const HOST = "http://localhost:5000"
    before(done => app.listen(5000, done))
    after(done => app.close(done))

    it("Should test for message", async () => {
        await socketTester(HOST)
            .wait(() => socketTester(HOST)
                .on("feedback")
                .expect("hello"))
            .emit("broadcast", "hello")
    })

    it("Should test timeout", async () => {
        await socketTester(HOST)
            .on("feedback")
            .timeout()
    })

    it("Should be able to set timeout value", async () => {
        let start = new Date();
        await socketTester(HOST)
            .on("feedback")
            .timeout(200)
        let gap = new Date().getTime() - start.getTime();
        Chai.expect(gap - 200).lessThan(100)
    })

    it("Should throw error when invalid expected value provided", async () => {
        try {
            await socketTester(HOST)
                .wait(() => socketTester(HOST)
                    .on("feedback")
                    .expect("hello"))
                .emit("broadcast", "hola")
        } catch (e) {
            Chai.expect(e.message).contains("expected 'hola' to deeply equal 'hello'")
        }
    })

    it("Should throw error when correct value provided but expected timeout", async () => {
        try {
            await socketTester(HOST)
                .wait(() => socketTester(HOST)
                    .on("feedback")
                    .timeout())
                .emit("broadcast", "hello")
        } catch (e) {
            Chai.expect(e.message).contains("Expected timeout but 'feedback' emitted")
        }
    })

})
