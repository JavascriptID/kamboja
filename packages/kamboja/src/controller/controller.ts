import { HttpRequest, Validator, BaseController, Handshake } from "kamboja-core"

export class Controller implements BaseController {
    context: HttpRequest | Handshake
    validator: Validator
}

