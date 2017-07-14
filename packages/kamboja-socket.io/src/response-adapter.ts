import { Core } from "kamboja"

export interface NativeSocket {
    to: (id: string) => SocketIO.Socket,
    broadcast: {
        emit: (event: string, data: any) => void
    }
}

export class ResponseAdapter implements Core.Response {
    body: any
    type: string
    status: number
    cookies: Core.Cookie[]
    header: { [key: string]: string | string[] }
    events?: Core.EventEmitted[]

    constructor(private socket: NativeSocket, private eventResponse?: (body: any) => void) { }

    send() {
        this.emitEvents()
        if (this.eventResponse)
            this.eventResponse({ status: this.status, body: this.body })
    }

    emitEvents() {
        if (this.events) this.events.forEach(event => {
            if (event.recipients) event.recipients.forEach(recipient => {
                if (recipient.type == "Room" || recipient.type == "SocketId")
                    this.socket.to(recipient.id!).emit(event.name, event.payload || this.body)
                else
                    this.socket.broadcast.emit(event.name, event.payload || this.body)
            })
        })
    }
}