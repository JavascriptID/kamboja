import {Controller, route} from "../../../src"

export class SimpleController extends Controller {
    
    @route.get("/route/got/:parameter")
    actionHaveNoParameter(){}

    @route.get("/route/:associated/:notAssociated")
    postMethod(associated:any){}

    @route.get("/route/have/no/parameter")
    actionHaveParameter(parameter:any){}
}