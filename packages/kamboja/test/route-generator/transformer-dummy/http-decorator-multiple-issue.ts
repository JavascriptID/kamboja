import { route } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @route.get("/this/is/the/first/route/:nonPar")
    @route.get("/this/is/the/:nonPar/route")
    actionHaveNoParameter(par:any){}

}