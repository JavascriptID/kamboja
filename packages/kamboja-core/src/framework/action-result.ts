import { Cookie, CookieOptions, HttpRequest } from "../http";
import { Handshake, SocketEvent } from "../socket";
import { Response } from "./response";
import { RouteInfo } from "../router";

export class ActionResult {
    engine: "Express" | "General"
    header: { [key: string]: string | string[] } = {}
    cookies?: Cookie[]
    events?: SocketEvent[]

    constructor(public body: any, public status?: number, public type?: string) {
        this.engine = "General"
    }

    setHeader(key: string, value: string | string[]) {
        this.header[key] = value;
        return this
    }

    setCookie(key: string, value: string, options?: CookieOptions) {
        if (!this.cookies) this.cookies = []
        this.cookies.push({ key: key, value: value, options: options })
        return this
    }

    setStatus(status: number) {
        this.status = status;
        return this
    }

    setType(type: string) {
        this.type = type;
        return this;
    }

    broadcast(event: string, data?: any) {
        if (!this.events) this.events = []
        this.events.push({ type: "Broadcast", name: event, payload: data || this.body })
        return this;
    }

    emit(event: string, id: string | string[], data?: any) {
        if (!this.events) this.events = []
        this.events.push({ type: "Private", id: id, name: event, payload: data || this.body })
        return this;
    }

    execute(context: HttpRequest | Handshake, response: Response, routeInfo?: RouteInfo) {
        response.send(this)
    }
}