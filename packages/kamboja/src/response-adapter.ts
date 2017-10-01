import * as Express from "express"
import * as Core from "kamboja-core"

export class ResponseAdapter implements Core.Response {
    constructor(public nativeResponse: Express.Response, public nativeNextFunction: Express.NextFunction) { }

    private setup(result: Core.ActionResult) {
        this.nativeResponse.set(result.header)
        if (result.status)
            this.nativeResponse.status(result.status)
        if (result.type)
            this.nativeResponse.type(result.type!)
        if (result.cookies) {
            result.cookies.forEach(x => {
                this.nativeResponse.cookie(x.key, x.value, x.options!)
            })
        }
    }

    json(result: Core.ActionResult) {
        this.setup(result)
        this.nativeResponse.json(result.body)
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