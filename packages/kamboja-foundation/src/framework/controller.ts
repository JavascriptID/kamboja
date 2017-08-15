import { HttpRequest, BaseController, Handshake, Validator } from "kamboja-core";

export class Controller implements BaseController {
    context: HttpRequest | Handshake
    validator: Validator
}

