import { ApiController, JsonActionResult, response } from "kamboja-express"
import { BroadcastEvent, PrivateEvent } from "../../../src"
export class HttpController extends ApiController {
    add(body: any) {
        return new JsonActionResult("Success!")
            .emit(new BroadcastEvent("http/updated", "Hello"))
    }

    send(to: number) {
        return response
            .json(`Hello this message from ${this.request.user.id}`)
            .emit(new PrivateEvent("http/send", { id: to.toString() }))
    }
}
