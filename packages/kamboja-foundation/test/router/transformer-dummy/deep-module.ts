import {Controller} from "../../../src"

export module ParentModule {
    export class SimpleController extends Controller {
        myOtherGetAction(par1:any) { }
    }
    export module InnerModule {
        export class SimpleController extends Controller {
            myActionWithoutParameter() { }
        }
    }
}

