import {Controller, route} from "../../../src"

@route.root("/absolute/:none")
export class AbsoluteRootController extends Controller {
    @route.get("relative/:no")
    index(par1:any, par2:any) { }

    other(par1:any, par2:any) { }
}

@route.root("relative/:par2")
export class RelativeRootController extends Controller {
    @route.get("relative")
    index(par1:any, par2:any) { }
}