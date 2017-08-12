import { Validator } from "../validator";
import { BaseController } from "./base-controller";
import {
    Handshake,
    HttpRequest,
} from "../interfaces";

export class ApiController implements BaseController {
    context: HttpRequest | Handshake
    validator: Validator
}