import { http } from "../../../src"
import { ApiController } from "../../../src/controller"


export class UserController extends ApiController {
    @http.get("this/is/dupe")
    list(offset:number, take:number) { }
    @http.get("this/is/dupe")
    get() { }
}