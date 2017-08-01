import { Core } from "kamboja"

export class GlobalResponse implements Core.Response {

    constructor(private server: SocketIO.Server, private registry: Core.SocketRegistry) { }

    async send(result: Core.ResponseResult) {
        if (result.events) {
            for (let event of result.events) {
                let payload = event.payload || result.body;
                switch (event.type) {
                    case "Room":
                        this.emit(event.id!, event.name, payload)
                        break;
                    case "Private":
                        this.emit(event.id!, event.name, payload, id => this.registry.lookup(id))
                        break;
                    case "Broadcast":
                        this.server.sockets.emit(event.name, payload)
                        break;
                }
            }
        }
    }

    private async emit(id: string | string[], name: string, payload: any, lookup?: (id: string) => Promise<string>) {
        let ids: string[] = Array.isArray(id) ? id : [id]
        for (let socketId of ids) {
            socketId = await (lookup ? lookup(socketId) : Promise.resolve(socketId))
            this.server!.to(socketId).emit(name, payload)
        }
    }
}