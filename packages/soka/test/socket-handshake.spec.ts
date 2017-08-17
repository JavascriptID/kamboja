import { SocketIoHandshake } from "../src/socket-handshake"
import * as Chai from "chai"

describe("SocketIO Handshake", () => {
    it("Should able to return header properly", () => {
        let handshake = new SocketIoHandshake(<any>{
            handshake: {
                headers: { "KEY": "value" },
                query: { "KEY": "value" }
            }
        })
        Chai.expect(handshake.getHeader("key")).eq("value")
        Chai.expect(handshake.getParam("key")).eq("value")
    })

    it("Should not error when no header provided", () => {
        let handshake = new SocketIoHandshake(<any>{
            handshake: {
                query: { "KEY": "value" }
            }
        })
        Chai.expect(handshake.getHeader("key")).undefined
        Chai.expect(handshake.getParam("key")).eq("value")
    })

    it("Should not error when no param provided", () => {
        let handshake = new SocketIoHandshake(<any>{
            handshake: {
                headers: { "KEY": "value" },
            }
        })
        Chai.expect(handshake.getHeader("key")).eq("value")
        Chai.expect(handshake.getParam("key")).undefined
    })

    it("Should not error when no handshake provided", () => {
        let handshake = new SocketIoHandshake(<any>{
        })
        Chai.expect(handshake.getHeader("key")).undefined
        Chai.expect(handshake.getParam("key")).undefined
    })
})