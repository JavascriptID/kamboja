import { Core } from "kamboja"

export class BroadcastResponse implements Core.Response {

    constructor(private server: SocketIO.Server) { }

    async send(result: Core.ResponseResult) {
        if (result.events){
            for (let event of result.events) {
                this.server.sockets.emit(event.name, event.payload || result.body)
            }
        }
    }
}