import { Controller, Core } from "kamboja-foundation"
import { view, json } from "../../../src"

export class HomeController extends Controller {
    index(): Core.ActionResult {
        return view()
    }

    json() {
        return json({ message: "Hello world" })
    }
}