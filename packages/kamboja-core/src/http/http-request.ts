import { HttpMethod } from "./http-method";
import { AuthUser } from "../security";
import * as Url from "url"

export interface HttpRequest {
    contextType: "HttpRequest"
    cookies: { [key: string]: string }
    user: AuthUser
    body: any
    //url: Url.Url
    route: string
    getHeader(key: string): string | undefined
    getCookie(key: string): string | undefined
    getParam(key: string): string | undefined
}