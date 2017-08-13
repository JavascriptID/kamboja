import {Controller, route} from "../../../src"

export class SimpleController extends Controller {
    
    @route.ignore()
    privateMethod(par1:any, par2:any) { }

    publicMethod(par1:any) { }
}