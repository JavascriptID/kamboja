import { HttpRequest, Validator, HttpController } from "kamboja-core"

export class Controller extends HttpController {
    request: HttpRequest
    validator: Validator
}

