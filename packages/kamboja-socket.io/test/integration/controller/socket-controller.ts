import { SocketController, broadcast, emit, route, Core } from "kamboja-express"
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