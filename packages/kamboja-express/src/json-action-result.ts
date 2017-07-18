import { Core } from "kamboja"
import { ResponseAdapter } from "./response-adapter"

export class JsonActionResult extends Core.ActionResult {
    constructor(body:any, status?:number){
        super(body, status)
    }

    async execute(request: Core.HttpRequest, response: ResponseAdapter, routeInfo: Core.RouteInfo): Promise<void> {
        response.json(this)
    }
}
