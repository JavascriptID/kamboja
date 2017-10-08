import { Controller, view, ActionResult } from "../../../src"


export class HomeController extends Controller {
    index(): ActionResult {
        return view()
    }
}