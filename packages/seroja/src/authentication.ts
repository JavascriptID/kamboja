import { Middleware, Core } from "kamboja-foundation"

export class Authentication extends Middleware {
    execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        
        throw new Error("Method not implemented.");
    }
}