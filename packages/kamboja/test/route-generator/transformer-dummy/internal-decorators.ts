import { internal, http } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @internal()
    privateMethod(par1:any, par2:any) { }

    publicMethod(par1:any) { }
}