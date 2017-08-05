import { route } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @route.get("/this/is/the/first/route")
    @route.get("/this/is/the/other/route")
    actionHaveNoParameter(){}

    @route.get("/this/is/:parameter")
    @route.get("/the/:parameter/in/the/middle")
    actionWithParameter(parameter:any){}
}