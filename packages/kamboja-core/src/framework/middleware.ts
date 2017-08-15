import { Handshake } from "../socket";
import { HttpRequest } from "../http";
import { Invocation } from "./invocation";
import { ActionResult } from "./action-result";

export type MiddlewaresType = string | string[] | Middleware | Middleware[]

export interface Middleware {
    execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult>;
}
