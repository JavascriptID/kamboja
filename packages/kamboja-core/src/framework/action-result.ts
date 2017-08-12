import { Cookie, CookieOptions, HttpRequest } from "../http";
import { Handshake, SocketEvent } from "../socket";
import { Response } from "./response";
import { RouteInfo } from "../router";

export interface ActionResult  {
    body:any;
    status?:number
    engine?: "Express" | "General"
    header?: { [key: string]: string | string[] }
    cookies?: Cookie[]
    events?: SocketEvent[]
    setHeader?: (key: string, value: string | string[]) => ActionResult;
    setCookie?:(key: string, value: string, options?: CookieOptions) => ActionResult
    setStatus?:(status: number) => ActionResult
    setType?:(type: string) => ActionResult
    broadcast?:(event: string, data?: any) => ActionResult
    emit?:(event: string, id: string | string[], data?: any) => ActionResult
    execute?:(context: HttpRequest | Handshake, response: Response, routeInfo?: RouteInfo) => void
}