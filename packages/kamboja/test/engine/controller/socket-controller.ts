import { SocketController, Core, val } from "../../../src"

export class MyRealTimeController extends SocketController {
    sendActionResult() {
        return new Core.ActionResult("Hello")
    }

    sendWithParam(msg: any) {
        return new Core.ActionResult(msg)
    }

    sendWithStatus() {
        return new Core.ActionResult("Hello", 400)
    }

    throwError(){
        throw new Error("FATAL ERROR")
    }

    withValidation(@val.required() name:string){
        throw new Error("FATAL ERROR")
    }

    sendValue(){
        return 1996
    }
}