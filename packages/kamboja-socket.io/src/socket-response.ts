import { Core } from "kamboja"

export class SocketResponse implements Core.Response {

    constructor(private registry?: Core.SocketRegistry, private socket?: SocketIO.Socket, private callback?: (body: any) => void) { }

    async send(result: Core.ResponseResult) {
        if (result.events && this.socket && this.registry) {
            for (let event of result.events) {
                switch (event.type) {
                    case "Private":
                        if (!event.id) throw new Error(`SocketEvent ID for Private type can't be empty`);
                        await this.emit(event.id, event.name, event.payload || result.body, id => this.registry!.lookup(id))
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
            for (let socketId of id) {
                socketId = await (lookup ? lookup(socketId) : Promise.resolve(socketId))
                this.socket!.to(socketId).emit(name, payload)
            }
        }
        else {
            let socketId = await (lookup ? lookup(id) : Promise.resolve(id))
            this.socket!.to(socketId).emit(name, payload)
        }
    }
}