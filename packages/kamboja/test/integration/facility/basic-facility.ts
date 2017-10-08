import { Application, Middleware } from "../../../src"
import { Facility } from "kamboja-core"

export class BasicFacility implements Facility {
    apply(app: Application) {
        app.set("skipAnalysis", true);
        app.set("showLog", "None");
    }
}
