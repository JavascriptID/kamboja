import { route } from "../../../src"
import { ApiController } from "../../../src/controller"


export class UserController extends ApiController {
    @route.get("this/is/dupe")
    list(offset:number, take:number) { }
    @route.get("this/is/dupe")
    get() { }
}