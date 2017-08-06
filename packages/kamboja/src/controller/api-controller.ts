import { HttpRequest, Response, ActionResult, Validator, BaseController } from "kamboja-core"

export class ApiController implements BaseController {
    context: HttpRequest
    validator: Validator
}
