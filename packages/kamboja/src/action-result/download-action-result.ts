import { Core } from "kamboja-foundation"
import { ResponseAdapter } from "../response-adapter"

export class DownloadActionResult extends Core.ActionResult {
    constructor(public path: string) {
        super(undefined)
        this.engine = "Express"
    }

    execute(request: Core.HttpRequest, response: ResponseAdapter, routeInfo: Core.RouteInfo): Promise<void> {
        return Promise.resolve()
            .then(x => response.download(this, this.path))
    }
}