import { ActionResult } from "./action-result";

export interface Response {
    send(result: ActionResult): void
}
