import { ApiController, JsonActionResult, route, broadcast, emit, json } from "kamboja"
export class HttpController extends ApiController {    
    broadcast(){
        return broadcast("message", "Success!")
    }

    private(to: string) {
        return emit("message", to, "Success!")
    }

    noEmit(){
        return new JsonActionResult("Success!")
    }

    sendMultiple(to:string[]){
        return emit("message", to, "Success!")
    }
}