import * as Express from "express"
import { AuthUser } from "kamboja-core"
import * as Lodash from "lodash"

declare module "express" {
    interface Request {
        contextType: "HttpRequest"
        user: AuthUser
        getHeader(key: string): string | undefined
        getCookie(key: string): string | undefined
        getParam(key: string): string | undefined
        response: Express.Response
    }
}

export interface HttpRequest extends Express.Request {}

export function convert(req: Express.Request, response:Express.Response) {
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
    req.response = response;
    return req;
}
