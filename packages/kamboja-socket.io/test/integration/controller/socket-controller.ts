import { SocketController, JsonActionResult, route, Core } from "kamboja-express"
import { BroadcastEvent, PrivateEvent } from "../../../src"
export class ChatController extends SocketController {

    @route.event("connection")
    connection() {
        return new Core.ActionResult(this.socket.user)
            .emit(new BroadcastEvent("presence"))
    }

    broadcast() {
        return new Core.ActionResult("Success!")
            .emit(new BroadcastEvent("message"))
    }

    private(msg: { to: string, msg: string }) {
        return new Core.ActionResult("Success!")
            .emit(new PrivateEvent("message", { id: msg.to }, msg.msg))
    }
}