import { HttpRequest, Response, ActionResult, Validator, BaseController, Handshake } from "kamboja-core"

export class ApiController implements BaseController {
    context: HttpRequest | Handshake
    validator: Validator
}
