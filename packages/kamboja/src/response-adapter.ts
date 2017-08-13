import { Core } from "kamboja-foundation"
import * as Express from "express"

export class ResponseAdapter implements Core.Response {
    constructor(public nativeResponse: Express.Response, public nativeNextFunction: Express.NextFunction) { }

    private setup(result: Core.ActionResult) {
        result.status = result.status || 200;
        result.type = result.type || "text/plain"
        this.nativeResponse.set(result.header)
        this.nativeResponse.status(result.status)
        if (result.cookies) {
            result.cookies.forEach(x => {
                this.nativeResponse.cookie(x.key, x.value, x.options!)
            })
        }
    }

    json(result: Core.ActionResult) {
        this.setup(result)
        this.nativeResponse.status(result.status!).json(result.body)
    }

    redirect(result: Core.ActionResult, path: string) {
        this.setup(result)
        this.nativeResponse.redirect(path)
    }

    download(result: Core.ActionResult, path: string) {
        this.setup(result)
        this.nativeResponse.download(path)
    }

    file(result: Core.ActionResult, path: string) {
        this.setup(result)
        this.nativeResponse.sendFile(path)
    }

    render(result: Core.ActionResult, viewName: string, model: any) {
        this.setup(result)
        this.nativeResponse.render(viewName, model)
    }

    send(result: Core.ActionResult) {
        if (result.type == "application/json") return this.json(result)
        this.setup(result)
        this.nativeResponse.type(result.type!)
        switch (typeof result.body) {
            case "number":
            case "boolean":
                this.nativeResponse.send(result.body.toString());
                break
            case "undefined":
                this.nativeResponse.end()
                break
            default:
                this.nativeResponse.send(result.body);
        }
    }
}