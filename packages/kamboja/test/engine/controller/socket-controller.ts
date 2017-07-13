import { SocketController, Core } from "../../../src"

export class MyRealTimeController extends SocketController {
    sendActionResult() {
        return new Core.ActionResult("Hello")
    }

    sendWithParam(msg: any) {
        return new Core.ActionResult(msg)
    }

    sendWithStatus() {
        return new Core.ActionResult("Hello", 400)
    }

    sendAndEmit(msg: any) {
        return new Core.ActionResult(msg)
            .emit("chat/event", { type: "SocketId", id: "200" })
    }

    throwError(){
        throw new Error("FATAL ERROR")
    }
}