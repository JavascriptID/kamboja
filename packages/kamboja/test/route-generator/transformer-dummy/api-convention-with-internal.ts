import { internal, http } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    @internal()
    getByPage(offset:number, pageWidth:number){}

    get(id:string){}
}