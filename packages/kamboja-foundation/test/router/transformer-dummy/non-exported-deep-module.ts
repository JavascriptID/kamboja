import {Controller} from "../../../src"

export module ParentModule {
    export class SimpleController extends Controller {
        myOtherGetAction(par1:any) { }
    }
    //this module is not exported
    module InnerModule {
        export class SimpleController extends Controller {
            myActionWithoutParameter() { }
        }
        export class SimpleNoInheritance{
            myOtherMethod(){}
        }
    }
}

