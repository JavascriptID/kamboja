import { route } from "../../../src"
import {ApiController} from "../../../src"

export class SimpleController extends ApiController {
    
    @route.get()
    getByPage(offset:number, pageWidth:number){}

}