import {SocketController, route} from "../../../src"

export class ChatController extends SocketController {

    @route.event("connection")
    connection(){ }

    send(msg:any){}
}