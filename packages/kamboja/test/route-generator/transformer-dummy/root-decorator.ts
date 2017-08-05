import { route } from "../../../src"
import { Controller, ApiController } from "../../../src/controller"



export namespace Namespace {
    @route.root("/absolute")
    export class AbsoluteRootController extends Controller {
        @route.get("relative")
        index() { }
        @route.get("/abs/url")
        myGetAction() { }
        @route.on("custom-event")
        customHandler(){}
    }

    @route.root("relative")
    export class RelativeRootController extends Controller {
        @route.get("relative")
        index() { }
        @route.get("/absolute/url")
        myGetAction() { }
    }
}