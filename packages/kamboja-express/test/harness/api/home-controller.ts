import { Controller, view, Core } from "../../../src"


export class HomeController extends Controller {
    index():Core.ActionResult {
        return view()
    }
}