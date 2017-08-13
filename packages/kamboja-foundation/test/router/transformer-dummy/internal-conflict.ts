import {Controller, route} from "../../../src"

export class SimpleController extends Controller {
    
    //conflict decorators 
    @route.ignore()
    @route.get()
    privateMethod(par1:any, par2:any) { }

    publicMethod(par1:any) { }
}