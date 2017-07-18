import { HttpRequest, Response, ActionResult, Validator, BaseController } from "kamboja-core"

export class ApiController implements BaseController {
    request: HttpRequest
    validator: Validator
}
