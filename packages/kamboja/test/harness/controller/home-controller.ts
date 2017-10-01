import { Controller } from "kamboja-foundation"
import { view, json } from "../../../src"
import * as Core from "kamboja-core"
import { IncomingMessage } from "http"

export class HomeController extends Controller {
    index(): Core.ActionResult {
        return view()
    }

    json() {
        return json({ message: "Hello world" })
    }

    requestInstance() {
        if (this.context instanceof IncomingMessage) {
            return { success: true }
        }
        else {
            throw Error("Not instance of IncomingMessage")
        }
    }
}