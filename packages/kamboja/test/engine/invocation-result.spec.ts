import * as Chai from "chai"
import { InvocationResult } from "../../src/engine/invocation-result"
import { Core } from "../../src"
import * as Test from "kamboja-testing"
import * as H from "../helper"
import * as Sinon from "sinon"

describe("InvocationResult", () => {
    let request: Core.HttpRequest & Test.Mockable<Core.HttpRequest, Sinon.SinonStub>
    let response: Core.HttpResponse & Test.Mockable<Core.HttpResponse, Sinon.SinonSpy>

    beforeEach(() => {
        request = Test.stub(new Test.HttpRequest())
        response = Test.spy(new Test.HttpResponse())
    })

    it("Should allow primitive value result", async () => {
        let result = await InvocationResult.create("Hello")
        let actionResult = result
        Chai.expect(actionResult.body).eq("Hello")
        result.execute(request, response, {})
    })

    it("Should allow undefined value result", async () => {
        let result = await InvocationResult.create(undefined)
        let actionResult = result
        Chai.expect(actionResult.body).eq(undefined)
    })

    it("Should allow ActionResult result", async () => {
        let result = await InvocationResult.create(new Core.ActionResult({ message: "Hello" }))
        Chai.expect(result.body).deep.eq({ message: "Hello" })
    })

    it("Should allow Promise value result", async () => {
        let result = await InvocationResult.create(Promise.resolve("Hello"))
        let actionResult = result
        Chai.expect(actionResult.body).eq("Hello")
    })

    it("Should allow Promise of ActionResult", async () => {
        let result = await InvocationResult.create(Promise.resolve(new Core.ActionResult({ message: "Hello" })))
        Chai.expect(result.body).deep.eq({ message: "Hello" })
    })
})