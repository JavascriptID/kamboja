import * as Core from "kamboja-core";

export abstract class Middleware  implements Core.Middleware{
    abstract execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult>;
}