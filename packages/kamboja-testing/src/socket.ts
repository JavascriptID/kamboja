import * as Core from "kamboja-core"

export class Socket implements Core.Socket {
    contextType: "Socket" = "Socket"
    header: any;
    id: string;
    rooms: string[];
    async join(roomName: string): Promise<void> { }
    async leave(roomName: string): Promise<void> { }
    async leaveAll(): Promise<void> { }
}