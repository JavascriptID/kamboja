import {Middleware as BaseMiddleware} from "kamboja-foundation"
import {Request} from "./request-adapter"
import {Handshake, Invocation, ActionResult} from "kamboja-core"

export abstract class Middleware extends BaseMiddleware {
    abstract execute(context: Handshake | Request, next: Invocation): Promise<ActionResult>;    
}