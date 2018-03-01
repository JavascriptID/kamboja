import { SocketIoEngine } from "./socket-io-engine"
import { RealTimeMiddleware } from "./realtime-middleware"
import { SocketIoHandshake } from "./socket-handshake"
import { SocketResponse } from "./socket-response"
import {InMemorySocketRegistry} from "./inmemory-socket-registry"
import * as SocketIo from "socket.io"
import * as Core from "kamboja-core"

export interface RealTimeFacilityOption {
    registry?:Core.SocketRegistry, 
    server?:SocketIO.Server
}

export class RealTimeFacility implements Core.Facility {
    option:RealTimeFacilityOption
    constructor( option?: RealTimeFacilityOption){
        this.option = Object.assign({
            registry: new InMemorySocketRegistry(),
            server: SocketIo()
        }, option)
    }

    apply(app: Core.Application): void {
        app.set("socketEngine", new SocketIoEngine(this.option.server!, this.option.registry!))
        app.use(new RealTimeMiddleware(this.option.server!, this.option.registry!))
    }
}