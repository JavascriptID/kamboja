import { route } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @route.get("/route/got/:parameter")
    actionHaveNoParameter(){}

    @route.get("/route/:associated/:notAssociated")
    postMethod(associated:any){}

    @route.get("/route/have/no/parameter")
    actionHaveParameter(parameter:any){}
}