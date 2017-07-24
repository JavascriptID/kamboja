import { internal, Controller, Core } from "kamboja"
import {view} from "../../../src"

export class HomeController extends Controller {
    index():Core.ActionResult  {
        return view()
    }
}