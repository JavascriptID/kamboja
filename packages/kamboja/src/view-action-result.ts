import { Core } from "kamboja-foundation"
import { ResponseAdapter } from "./response-adapter"

const ViewOutsideControllerError = "Relative view path can not be use inside middlewares"

export class ViewActionResult extends Core.ActionResult {
    constructor(public model?:any, public viewName?: string) {
        super(null)
        this.engine = "Express"
    }

    async execute(request: Core.HttpRequest, response: ResponseAdapter, routeInfo: Core.RouteInfo): Promise<void> {

        // results.view({})
        if (!this.viewName) {
            if (!routeInfo) throw new Error(ViewOutsideControllerError);
            let className = this.getClassName(routeInfo.qualifiedClassName!)
            let viewPath = className + "/" + routeInfo.methodMetaData!.name.toLowerCase()
            response.render(this, viewPath, this.model);
        }
        // results.view({}, "list")
        else if (this.viewName && this.viewName.indexOf("/") == -1) {
            if (!routeInfo) throw new Error(ViewOutsideControllerError);
            let className = this.getClassName(routeInfo.qualifiedClassName!)
            let viewPath = className + "/" + this.viewName;
            response.render(this, viewPath, this.model);
        }
        // results.view({}, "user/list")
        else 
            response.render(this, this.viewName, this.model);
    }

    private getClassName(fullQualifiedClassName: string) {
        let tokens = fullQualifiedClassName.split(",")
        let rawName = tokens[0].toLowerCase();
        let idx = rawName.lastIndexOf("controller");
        if (idx > 0)
            return rawName.substring(0, idx)
        return rawName;
    }
}
