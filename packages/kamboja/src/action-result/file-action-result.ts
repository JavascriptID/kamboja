import { Core } from "kamboja-foundation"
import { ResponseAdapter } from "../response-adapter"

export class FileActionResult extends Core.ActionResult {
    constructor(public path: string) {
        super(undefined)
        this.engine = "Express"
    }

    async execute(request: Core.HttpRequest, response: ResponseAdapter, routeInfo: Core.RouteInfo): Promise<void> {
        response.file(this, this.path)
    }
}
