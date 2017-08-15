import {Controller, route} from "../../../src"

export class SimpleController extends Controller {
    
    @route.get()
    getMethod(){}

    @route.post()
    postMethod(params:any){}

    @route.put()
    putMethod(){}

    @route.delete()
    deleteMethod(){}
}