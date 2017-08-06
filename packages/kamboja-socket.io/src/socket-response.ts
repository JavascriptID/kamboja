import { Core } from "kamboja"
import { Socket } from "./socket-adapter"

export class SocketResponse implements Core.Response {

    constructor(private registry: Core.SocketRegistry, private socket: Socket, private callback?: (body: any) => void) { }

    async send(result: Core.ResponseResult) {
        if (result.events && this.socket && this.registry) {
            for (let event of result.events) {
                let payload = event.payload || result.body;
                if (event.type == "Broadcast")
                    this.socket.emit(event.type, event.name, payload)
                else {
                    if (!event.id) throw new Error(`SocketEvent ID can't be empty on event '${event.name}' of type ${event.type} `);
                    if (!Array.isArray(event.id)) event.id = [event.id]
                    for (let id of event.id) {
                        let curId = id;
                        if (event.type == "Private") curId = await this.registry.lookup(id)
                        this.socket.emit(event.type, event.name, payload, curId)
                    }
                }
            }
        }
        if (this.callback) this.callback(result)
    }
}