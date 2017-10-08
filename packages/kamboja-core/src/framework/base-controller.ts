import { HttpRequest } from "../http";
import { Handshake } from "../socket";
import { Validator } from "../validator";
import {InvocationBase} from "./invocation-base"

export interface BaseController {
    request:HttpRequest 
    handshake: Handshake;
    invocation: InvocationBase
    validator: Validator;
}
