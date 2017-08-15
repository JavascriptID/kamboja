import { BaseController, HttpRequest, Handshake, Validator } from "kamboja-core";

export class ApiController implements BaseController {
    context: HttpRequest | Handshake
    validator: Validator
}