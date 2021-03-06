import { ResponseAdapter } from "../response-adapter"
import * as Core from "kamboja-core"

export class JsonActionResult extends Core.ActionResult {
    constructor(body: any, status?: number) {
        super(body, status)
        this.engine = "Express"
    }

    execute(request: Core.HttpRequest, response: ResponseAdapter, routeInfo: Core.RouteInfo): Promise<void> {
        return new Promise(x => x(response.json(this)))
    }
}
