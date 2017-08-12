import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Sinon from "sinon"
import * as Url from "url"
import { ActionResultBase } from "../../src";
import { HttpRequest, HttpResponse } from "kamboja-testing"

describe("ActionResult", () => {
    let request: HttpRequest;
    let response: HttpResponse;
    let sendSpy: Sinon.SinonSpy;

    beforeEach(() => {
        request = new HttpRequest()
        response = new HttpResponse()
        sendSpy = Sinon.spy(response, "send")
    })

    it("Should fill response properties properly", async () => {
        let result = new ActionResultBase("Halo", 400, "application/json")
        result.cookies = [{ key: "Halo", value: "Hello" }]
        result.header = { Accept: "text/*, application/json" }
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].body).eq("Halo")
        Chai.expect(sendSpy.getCall(0).args[0].status).eq(400)
        Chai.expect(sendSpy.getCall(0).args[0].type).eq("application/json")
        Chai.expect(sendSpy.getCall(0).args[0].cookies).deep.eq([{ key: "Halo", value: "Hello" }])
        Chai.expect(sendSpy.getCall(0).args[0].header).deep.eq({ Accept: "text/*, application/json" })
    })

    it("Should able to set header using chainable api", async () => {
        let result = new ActionResultBase("Halo")
            .setHeader("Accept", "text/*, application/json")
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].header).deep.eq({ Accept: "text/*, application/json" })
    })

    it("Should able to set status using chainable api", async () => {
        let result = new ActionResultBase("Halo")
            .setStatus(500)
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].status).eq(500)
    })

    it("Should able to set cookie using chainable api", async () => {
        let result = new ActionResultBase("Halo")
            .setCookie("Halo", "Hello")
            .setCookie("Hola", "Helo")
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].cookies)
            .deep.eq([
                { key: "Halo", value: "Hello", options: undefined },
                { key: "Hola", value: "Helo", options: undefined }
            ])
    })

    it("Should able to set content type using chainable api", async () => {
        let result = new ActionResultBase("Halo")
            .setType("application/pdf")
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].type).eq("application/pdf")
    })

    it("Should able to broadcast event using chainable api", async () => {
        let result = new ActionResultBase("Halo")
            .broadcast("new-message")
            .broadcast("second-message", { msg: "message" })
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].events).deep.eq([
            { type: 'Broadcast', name: 'new-message', payload: 'Halo' },
            { type: 'Broadcast', name: 'second-message', payload: { msg: 'message' } }
        ])
    })

    it("Should able to emit event using chainable api", async () => {
        let result = new ActionResultBase("Halo")
            .emit("new-message", "333")
            .emit("second-message", "333", { msg: "message" })
        await result.execute(request, response, undefined)
        Chai.expect(sendSpy.getCall(0).args[0].events).deep.eq([
            { type: 'Private', id: "333", name: 'new-message', payload: 'Halo' },
            { type: 'Private', id: "333", name: 'second-message', payload: { msg: 'message' } }
        ])
    })
})