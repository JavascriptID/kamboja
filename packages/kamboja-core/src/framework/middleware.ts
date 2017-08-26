import { Handshake } from "../socket";
import { HttpRequest } from "../http";
import { Invocation } from "./invocation";
import { ActionResult } from "./action-result";

export type MiddlewareFunction = (context:  Handshake | HttpRequest, next: Invocation) => Promise<ActionResult>;
export type MiddlewaresType = string  | Middleware | MiddlewareFunction

export interface Middleware {
    execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult>;
}
