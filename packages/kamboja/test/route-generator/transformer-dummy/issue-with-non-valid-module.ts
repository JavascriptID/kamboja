import { route } from "../../../src"
import { Controller, ApiController } from "../../../src/controller"

module MyModule {
    export class SimpleController extends Controller {
        @route.get("/this/is/the/:nonPar/route")
        actionHaveNoParameter(par:any) { }
    }
}
