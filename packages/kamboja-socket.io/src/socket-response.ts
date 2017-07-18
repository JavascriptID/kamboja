import { Core } from "kamboja"

export class SocketResponse implements Core.Response {

    constructor(private registry?: Core.SocketRegistry, private socket?: SocketIO.Socket, private callback?: (body: any) => void) { }

    async send(result: Core.ResponseResult) {
        if (result.events && this.socket && this.registry){
            for (let event of result.events) {
                switch (event.type) {
                    case "Private":
                        if (!event.id) throw new Error(`SocketEvent ID for Private type can't be null`);
                        let id = await this.registry.lookup(event.id);
                        this.socket.to(id).emit(event.name, event.payload || result.body)
                        break;
                    case "Room":
                        if (!event.id) throw new Error(`SocketEvent ID for Room type can't be null`);
                        this.socket.to(event.id).emit(event.name, event.payload || result.body)
                    default:
                        this.socket.broadcast.emit(event.name, event.payload || result.body)
                        break;
                }
            }
        }
        if (this.callback)
            this.callback({ status: result.status, body: result.body })
    }
}