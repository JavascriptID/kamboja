import { Core } from "kamboja"
import { Socket } from "./socket-adapter"

export class SocketResponse implements Core.Response {

    constructor(private socket: Socket, private callback?: (body: any) => void) { }

    async send(result: Core.ResponseResult) {
        if (result.events) {
            for (let event of result.events) {
                let payload = event.payload || result.body;
                if (event.type == "Broadcast")
                    this.socket.emit(event.type, event.name, payload)
                else {
                    if (!Array.isArray(event.id)) event.id = [event.id!]
                    for (let id of event.id) {
                        this.socket.emit(event.type, event.name, payload, id)
                    }
                }
            }
        }
        if (this.callback) this.callback({body: result.body, status: result.status})
    }
}