import { route, ApiController } from "../../../src"

export class UserController extends ApiController {
    @route.get("this/is/dupe")
    list(offset:number, take:number) { }
    @route.get("this/is/dupe")
    get() { }
}