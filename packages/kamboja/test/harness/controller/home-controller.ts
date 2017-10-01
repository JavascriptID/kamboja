import { Controller } from "kamboja-foundation"
import { view, json } from "../../../src"
import * as Core from "kamboja-core"

export class HomeController extends Controller {
    index(): Core.ActionResult {
        return view()
    }

    json() {
        return json({ message: "Hello world" })
    }
}