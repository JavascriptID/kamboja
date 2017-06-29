import { Controller, response, Core } from "../../../src"


export class HomeController extends Controller {
    index():Core.ActionResult {
        return response.view()
    }
}