import { ApiController } from "kamboja-foundation"

export class ApiWithErrorController extends ApiController {
    get(id:string) {
        throw Error("This is custom error")
    }
}
