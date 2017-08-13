import { Controller, Core } from "kamboja-foundation"
import {view} from "../../../src"

export class HomeController extends Controller {
    index():Core.ActionResult  {
        return view()
    }
}