import { ApiController, JsonActionResult } from "kamboja-express"

export class HttpController extends ApiController {
    add(body: any) {
        return new JsonActionResult("Success!")
            //.emit("http/updated", { type: "Broadcast" })
    }
}
