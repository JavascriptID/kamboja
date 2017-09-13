import { Core } from "kamboja"

export class SocketIoHandshake implements Core.Handshake {
    contextType: "Handshake" = "Handshake"
    headers: any
    id: string
    rooms: string[]
    user:Core.AuthUser
    params: { [key: string]: string }
    route:string;

    constructor(private nativeSocket: SocketIO.Socket, private packet?:any) {
        this.id = nativeSocket.id
        if (nativeSocket.rooms)
            this.rooms = Object.keys(nativeSocket.rooms)
        if (nativeSocket.handshake){
            this.headers = nativeSocket.handshake.headers
            this.params = nativeSocket.handshake.query
        }
    }
    
    private findCaseInsensitive(obj:any, key:string) {
        if(!obj) return
        let keys = Object.keys(obj);
        for (let item of keys) {
            if (item.toLowerCase() == key.toLowerCase())
                return obj[item]
        }
    }

    getHeader(key: string): string {
        return this.findCaseInsensitive(this.headers, key)
    }

    getParam(key: string): string {
        return this.findCaseInsensitive(this.params, key)
    }

    getPacket() {
        return this.packet;
    }
}
