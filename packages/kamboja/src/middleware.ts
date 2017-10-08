import { Middleware as MiddlewareBase, Handshake, Invocation, ActionResult } from "kamboja-core"
import { HttpRequest } from "./request-adapter"

export abstract class Middleware implements MiddlewareBase {
    abstract execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult> 
}