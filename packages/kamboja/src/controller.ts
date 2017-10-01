import { Controller as BaseController } from "kamboja-foundation"
import { Request } from "./request-adapter"
import { Handshake } from "kamboja-core"

export class Controller extends BaseController {
    context: Request | Handshake
}