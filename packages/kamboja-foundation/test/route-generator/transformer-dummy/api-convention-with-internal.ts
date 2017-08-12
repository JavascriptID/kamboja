import { route } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    @route.ignore()
    getByPage(offset:number, pageWidth:number){}

    get(id:string){}
}