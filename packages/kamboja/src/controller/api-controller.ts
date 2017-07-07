import { HttpRequest, HttpResponse, HttpActionResult, HttpController, Validator } from "kamboja-core"

export class ApiController extends HttpController {
    request: HttpRequest
    validator: Validator
}
