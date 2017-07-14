import { Core } from "kamboja"
import { SocketIoEngine } from "./socket-io-engine"
import { RealTimeMiddleware } from "./realtime-middleware"
import { SocketAdapter } from "./socket-adapter"
import { ResponseAdapter } from "./response-adapter"
import * as SocketIo from "socket.io"

export class RealTimeFacility implements Core.Facility {
    apply(app: Core.Application): void {
        let io = SocketIo()
        app.set("socketEngine", new SocketIoEngine(io))
        let nativeSocket = {
            to: io.to,
            broadcast: {
                emit: io.sockets.emit
            }
        }
        app.use(new RealTimeMiddleware(new SocketAdapter(<any>nativeSocket), new ResponseAdapter(<any>nativeSocket)))
    }
}