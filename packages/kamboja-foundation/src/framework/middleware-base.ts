import {
    Handshake,
    HttpRequest,
    Invocation,
    ActionResult,
    Middleware
} from "kamboja-core";

export abstract class MiddlewareBase  implements Middleware{
    abstract execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult>;
}