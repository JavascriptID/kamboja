import { Handshake, Validator, BaseController } from "kamboja-core"

export class SocketController implements BaseController {
    socket: Handshake;
    validator: Validator;
}