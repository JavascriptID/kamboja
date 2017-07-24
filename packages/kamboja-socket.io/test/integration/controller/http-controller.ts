import { ApiController, JsonActionResult, broadcast, emit, json } from "kamboja-express"
import { BroadcastEvent, PrivateEvent } from "../../../src"
export class HttpController extends ApiController {    
    broadcast(){
        return broadcast("message", "Success!")
    }

    private(to: number) {
        return emit("message", to.toString(), "Success!")
    }

    noEmit(){
        return new JsonActionResult("Success!")
    }
}