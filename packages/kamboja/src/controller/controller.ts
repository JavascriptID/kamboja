import { HttpRequest, Validator, BaseController } from "kamboja-core"

export class Controller implements BaseController {
    request: HttpRequest
    validator: Validator
}

