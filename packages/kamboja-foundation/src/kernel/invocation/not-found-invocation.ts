import { Invocation, ActionResult} from "kamboja-core"
import {HttpStatusError} from "../../framework"

export class NotFoundInvocation extends Invocation {
    constructor() { super() }

    proceed(): Promise<ActionResult> {
        throw new HttpStatusError(404, "Requested url not found")
    }
}