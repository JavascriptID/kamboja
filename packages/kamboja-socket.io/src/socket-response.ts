import { Core } from "kamboja"

export class SocketResponse implements Core.Response {

    constructor(private registry?: Core.SocketRegistry, private socket?: SocketIO.Socket, private callback?: (body: any) => void) { }

    async send(result: Core.ResponseResult) {
        if (result.events && this.socket && this.registry) {
            for (let event of result.events) {
                switch (event.type) {
                    case "Private":
                        if (!event.id) throw new Error(`SocketEvent ID for Private type can't be empty`);
                        await this.emit(event.id, event.name, event.payload || result.body, this.registry.lookup)
                        break;
                    case "Room":
                        if (!event.id) throw new Error(`SocketEvent ID for Room type can't be empty`);
                        await this.emit(event.id, event.name, event.payload || result.body)
                    default:
                        this.socket.broadcast.emit(event.name, event.payload || result.body)
                        break;
                }
            }
        }
        if (this.callback)
            this.callback({ status: result.status, body: result.body })
    }


    private async emit(id: string | string[], name: string, payload: any, lookup?: (id: string) => Promise<string>) {
        if (Array.isArray(id)) {
            for (let eventId of id) {
                eventId = await (lookup ? lookup(eventId) : Promise.resolve(eventId))
                this.socket!.to(eventId).emit(name, payload)
            }
        }
        else {
            let eventId = await (lookup ? lookup(id) : Promise.resolve(id))
            this.socket!.to(eventId).emit(name, payload)
        }
    }
}