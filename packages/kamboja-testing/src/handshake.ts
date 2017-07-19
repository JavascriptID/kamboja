import * as Core from "kamboja-core"

export class SocketHandshake implements Core.Handshake {
    contextType:"Handshake" = "Handshake";
    headers: any;
    id: string;
    rooms: string[];
    user: Core.AuthUser; 
    params: { [key: string]: string }
    
    private findCaseInsensitive(obj:any, key:string) {
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
}