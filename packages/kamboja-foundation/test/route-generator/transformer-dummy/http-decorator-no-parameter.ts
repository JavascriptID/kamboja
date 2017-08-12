import { route } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

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