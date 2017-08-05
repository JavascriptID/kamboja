import { route } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    
    @route.get()
    getByPage(offset:number, pageWidth:number){}

}