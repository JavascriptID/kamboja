import {Controller, ApiController} from "../../../src/controller"

export class BaseClass {
    theMethod(){}
}

export class SimpleController extends BaseClass {
    myGetAction(par1:any, par2:any) { }
    myOtherGetAction(par1:any) { }
    myActionWithoutParameter() { }
}