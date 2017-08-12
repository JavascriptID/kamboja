import {Controller, ApiController} from "../../../src/controller"

//this class is not exported
class NonExportedController extends Controller {
    myGetAction(par1:any, par2:any) { }
}

export class SimpleController extends Controller {
    myOtherGetAction(par1:any) { }
}