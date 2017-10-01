import { Request } from "express"
import { AuthUser } from "kamboja-core"
import * as Lodash from "lodash"

export { Request }

declare module "express" {
    interface Request {
        contextType: "HttpRequest"
        user: AuthUser
        getHeader(key: string): string | undefined
        getCookie(key: string): string | undefined
        getParam(key: string): string | undefined
    }
}

export function convert(req: Request) {
    req.contextType = "HttpRequest"
    req.getHeader = function (key: string) {
        return this.get(key)
    }
    req.getCookie = function (key: string) {
        if (this.cookies)
            return this.cookies[key]
    }
    req.getParam = function (key: string) {
        let params = Lodash.assign(this.params, this.query)
        return params[key]
    }
    return req;
}
