import { Core } from "kamboja"

export class SocketAdapter implements Core.Socket {
    contextType: "Socket"
    header: any
    id: string
    rooms: string[]
    constructor(private nativeSocket: SocketIO.Socket) {
        this.id = nativeSocket.id
        this.rooms = Object.keys(nativeSocket.rooms)
        this.header = nativeSocket
    }

    join(roomName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nativeSocket.join(roomName, (err) => {
                if (err) reject(err)
                resolve()
            })
        })
    }

    leave(roomName: string): Promise<void> {
        return new Promise(resolve => {
            this.nativeSocket.leave(roomName, () => {
                resolve()
            })
        })
    }

    async leaveAll(): Promise<void> {
        this.nativeSocket.leaveAll()
    }
}
