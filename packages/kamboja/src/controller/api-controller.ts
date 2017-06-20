import { HttpRequest, HttpResponse, ActionResult, BaseController, Validator } from "kamboja-core"

export class ApiController implements BaseController {
    request: HttpRequest
    validator: Validator
}
