import { ApiController, JsonActionResult, response } from "kamboja-express"
import { BroadcastEvent, PrivateEvent } from "../../../src"
export class HttpController extends ApiController {    
    broadcast(){
        return new JsonActionResult("Success!")
        .emit(new BroadcastEvent("message"))
    }

    private(to: number) {
        return new JsonActionResult("Success!")
            .emit(new PrivateEvent("message", { id: to.toString() }))
    }

    noEmit(){
        return new JsonActionResult("Success!")
    }
}