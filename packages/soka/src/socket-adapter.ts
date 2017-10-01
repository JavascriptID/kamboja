import * as Core from "kamboja-core"

export interface Socket {
    emit(type: string, name: string, payload: any, id?: string):void;
}

export class SocketAdapter {
    constructor(private socket:SocketIO.Socket){}

    emit(type: string, event: string, payload: any, id?: string){
        switch(type){
            case "Broadcast":
                this.socket.broadcast.emit(event, payload)
                break;
            //case "Room":
            case "Private":
                this.socket.to(id!).emit(event, payload)
                break;
        }
    }
}

export class ServerSocketAdapter {
    constructor(private server:SocketIO.Server){}
    
        emit(type: string, event: string, payload: any, id?: string){
            switch(type){
                case "Broadcast":
                    this.server.sockets.emit(event, payload)
                    break;
                //case "Room":
                case "Private":
                    this.server.sockets.to(id!).emit(event, payload)
                    break;
            }
        }
}