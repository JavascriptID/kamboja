import { HttpRequest, HttpResponse, spy, stub, socketTester } from "../src"
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
        response.send({ body: undefined })
    })

    it("Should provide stub properly", () => {
        let resp = stub(new HttpResponse());
        resp.send({ body: undefined });
        Chai.expect(resp.MOCKS.send.called).true
    })

    it("Should provide spy properly", () => {
        let resp = spy(new HttpResponse());
        resp.send({ body: undefined });
        Chai.expect(resp.MOCKS.send.called).true
    })
})

describe("Socket tester", () => {
    const HOST = "http://localhost:5000"
    before(done => app.listen(5000, done))
    after(done => app.close(done))

    it("Should test for message", async () => {
        let result = socketTester(HOST)
            .on("feedback")
            .expect("hello")
        let client = socketTester(HOST).emit("broadcast", "hello")
        await result;
        client.close()
    })

    it("Should test timeout", async () => {
        await socketTester(HOST)
            .on("feedback")
            .timeout()
    })
})
