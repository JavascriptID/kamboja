import { HttpMethod } from "./http-method";
import { AuthUser } from "../security";
import * as Url from "url"

export interface HttpRequest {
    contextType: "HttpRequest"
    httpVersion: string
    httpMethod: HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    user: AuthUser
    body: any
    referrer: string
    url: Url.Url
    getHeader(key: string): string | undefined
    getCookie(key: string): string | undefined
    getParam(key: string): string | undefined
    getAccepts(key: string | string[]): string | boolean
    isAuthenticated(): boolean
    getUserRole(): string
    route: string
}