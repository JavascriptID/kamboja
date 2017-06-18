import { internal, http } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @http.get("/route/got/:parameter")
    actionHaveNoParameter(){}

    @http.get("/route/:associated/:notAssociated")
    postMethod(associated:any){}

    @http.get("/route/have/no/parameter")
    actionHaveParameter(parameter:any){}
}