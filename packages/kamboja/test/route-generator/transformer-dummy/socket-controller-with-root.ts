import {SocketController, route} from "../../../src"

@route.root("hello")
export class ChatController extends SocketController {

    @route.event("connection")
    connection(){ }

    send(msg:any){}
}