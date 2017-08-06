import { HttpRequest, Validator, BaseController } from "kamboja-core"

export class Controller implements BaseController {
    context: HttpRequest
    validator: Validator
}

