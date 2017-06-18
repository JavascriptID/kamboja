import { internal, http } from "../../../src"
import { Controller, ApiController } from "../../../src/controller"



export namespace Namespace {
    @http.root("/absolute")
    export class AbsoluteRootController extends Controller {
        @http.get("relative")
        index(par1:any, par2:any) { }
        @http.get("/abs/url")
        myGetAction(par1:any, par2:any) { }
    }

    @http.root("relative")
    export class RelativeRootController extends Controller {
        @http.get("relative")
        index(par1:any, par2:any) { }
        @http.get("/absolute/url")
        myGetAction(par1:any, par2:any) { }
    }
}