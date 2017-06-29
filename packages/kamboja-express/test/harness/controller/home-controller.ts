import { internal, Controller, Core } from "kamboja"
import {response} from "../../../src"

export class HomeController extends Controller {
    index():Core.ActionResult  {
        return response.view()
    }
}