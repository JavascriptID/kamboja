import { ResponseAdapter } from "../response-adapter"
import * as Core from "kamboja-core"

export class FileActionResult extends Core.ActionResult {
    constructor(public path: string) {
        super(undefined)
        this.engine = "Express"
    }

    execute(request: Core.HttpRequest, response: ResponseAdapter, routeInfo: Core.RouteInfo): Promise<void> {
        return new Promise(x => x(response.file(this, this.path)))
    }
}
