import { Core } from "kamboja"

export class ResponseAdapter implements Core.Response {
    body: any
    type: string
    status: number
    cookies: Core.Cookie[]
    header: { [key: string]: string | string[] }
    events?: Core.EventEmitted[]

    constructor(private socket: SocketIO.Socket, private eventResponse?: (body: any) => void) { }

    send() {
        throw new Error("Not implemented sending events")
        /*if (this.eventResponse)
            this.eventResponse({ status: this.status, body: this.body })*/
    }
}