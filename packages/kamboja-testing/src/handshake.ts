import * as Core from "kamboja-core"

export class SocketHandshake implements Core.Handshake {
    contextType:"Handshake" = "Handshake";
    headers: any;
    id: string;
    rooms: string[];
    user: Core.AuthUser; 
    params: { [key: string]: string }
    getHeader(key: string): string {return ""}
    getParam(key: string): string { return ""}
}