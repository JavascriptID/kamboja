import * as Core from "kamboja-core"
import * as Url from "url"

export class HttpRequest implements Core.HttpRequest {
    contextType: "HttpRequest"
    httpVersion: string
    httpMethod: Core.HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    body: any
    referrer: string
    url: Url.URL
    user: any
    getHeader(key: string): string | undefined { return }
    getCookie(key: string): string | undefined { return }
    getParam(key: string): string | undefined { return }
    isAuthenticated() { return false }
    getAccepts(key: string | string[]): string | boolean { return false }
    getUserRole() { return "" }
    controllerInfo?: Core.ControllerInfo
    middlewares?: Core.Middleware[]
    route: string
}