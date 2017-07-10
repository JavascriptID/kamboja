import "reflect-metadata"
import * as Core from "kamboja-core"
import { Invoker } from "../invoker"
import { ParameterBinder } from "../../parameter-binder"
import { HttpStatusError } from "../../"
import { ControllerInvocation } from "./controller-invocation"
import { ErrorInvocation } from "../invocations"

export class SocketEventHandler {
    constructor(private option: Core.Facade,
        private socket: Core.Socket,
        private response: Core.Response,
        public controllerInfo: Core.ControllerInfo,
        private data: any) { }

    async execute() {
        let invoker = new Invoker(this.option)
        try {
            let invocation = new ControllerInvocation(this.option, this.socket, this.controllerInfo, this.data)
            let result = await invocation.proceed()
            if (result instanceof Core.RealTimeActionResult) {
                await this.socket.send(this.data, result.recipients)
                await result.execute(this.socket, this.response, this.controllerInfo)
            }
            else {
                throw new Error("Socket controller must return RealTimeActionResult")
            }
        }
        catch (e) {
            this.response.body = e.message
            this.response.status = e.status || 500
            this.response.send()
        }
    }
}