import { Core } from "kamboja"

export class SocketIoHandshake implements Core.Handshake {
    contextType: "Handshake"
    header: any
    id: string
    rooms: string[]
    user:Core.AuthUser
    constructor(private nativeSocket: SocketIO.Socket) {
        this.id = nativeSocket.id
        if (nativeSocket.rooms)
            this.rooms = Object.keys(nativeSocket.rooms)
        if (nativeSocket.handshake)
            this.header = nativeSocket.handshake.headers
    }
}
