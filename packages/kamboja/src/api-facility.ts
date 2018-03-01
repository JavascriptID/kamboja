import { Logger, Facility } from "kamboja-foundation"
import { KambojaApplication } from "./kamboja-express"
import { ActionResult } from "kamboja-core"
import * as BodyParser from "body-parser"
import { json } from "./action-result"

export class ApiFacility extends Facility {
    apply(app: KambojaApplication): void {
        app.useExpress(BodyParser.urlencoded({ extended: false }))
        app.useExpress(BodyParser.json())
        app.use((req, next) => {
            return new Promise<ActionResult>((resolve, reject) => {
                next.proceed()
                    .then(resolve)
                    .catch(e => {
                        let logType = <any>app.get("showLog")
                        let loger = new Logger(logType)
                        loger.error(e.toString())
                        resolve(json({ message: e.message }, 500))
                    })
            })
        })
    }
}