import { Socket, Validator, BaseController } from "kamboja-core"

export class SocketController implements BaseController {
    socket: Socket;
    validator: Validator;
}