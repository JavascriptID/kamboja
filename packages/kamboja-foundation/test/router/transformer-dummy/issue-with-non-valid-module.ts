import {Controller, route} from "../../../src"

module MyModule {
    export class SimpleController extends Controller {
        @route.get("/this/is/the/:nonPar/route")
        actionHaveNoParameter(par:any) { }
    }
}
