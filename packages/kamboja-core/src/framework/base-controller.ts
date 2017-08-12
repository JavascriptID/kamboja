import { HttpRequest } from "../http";
import { Handshake } from "../socket";
import { Validator } from "../validator";

export interface BaseController {
    context:HttpRequest | Handshake;
    validator: Validator;
}
