import { Request, Response } from "express"
import { AuthUser } from "kamboja-core"
import * as Lodash from "lodash"

declare module "express" {
    interface Request {
        contextType: "HttpRequest"
        user: AuthUser
        getHeader(key: string): string | undefined
        getCookie(key: string): string | undefined
        getParam(key: string): string | undefined
        response: Response
    }
}

export interface HttpRequest extends Request {}

export function convert(req: Request, response:Response) {
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
