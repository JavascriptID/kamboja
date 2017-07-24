import { SocketController, broadcast, emit, route, Core } from "kamboja-express"
import { BroadcastEvent, PrivateEvent } from "../../../src"
export class ChatController extends SocketController {

    @route.event("connection")
    connection() {
        return broadcast("presence", this.socket.user)
    }

    broadcast() {
        return broadcast("message","Success!")
    }

    private(msg: { to: string, msg: string }) {
        return emit("message", msg.to, "Success!")
    }
}