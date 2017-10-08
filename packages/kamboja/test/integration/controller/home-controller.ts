import { view, json, route, middleware, Controller } from "../../../src"
import * as Core from "kamboja-core"
import { IncomingMessage } from "http"
import * as Multer from "multer"
import * as Path from "path"

let upload = Multer({dest: Path.join(__dirname, "../upload/")})

export class HomeController extends Controller {
    index(): Core.ActionResult {
        return view()
    }

    json() {
        return json({ message: "Hello world" })
    }

    requestInstance() {
        if (this.request instanceof IncomingMessage) {
            return { success: true }
        }
        else {
            throw Error("Not instance of IncomingMessage")
        }
    }

    @route.post()
    @middleware.useExpress(upload.single("thefile"))
    upload(){ 
        return this.request.file.originalname;
    }

    returnCookie(){
        return this.request.getCookie("auth-example")
    }

    compression(){
        return "Lorem ipsum"
    }
}