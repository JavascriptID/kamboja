import { HttpRequest } from "../http";
import { Handshake } from "../socket";
import { Validator } from "../validator";
import {InvocationBase} from "./invocation-base"

export interface BaseController {
    context:HttpRequest | Handshake;
    invocation: InvocationBase
    validator: Validator;
}
