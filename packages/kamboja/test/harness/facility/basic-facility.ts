import { Facility, Application } from "../../../src"

export class BasicFacility implements Facility {
    apply(app: Application) {
        app.set("skipAnalysis", true);
        app.set("showLog", "None");
    }
}