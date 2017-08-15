import { Application } from "./application";

export interface Facility {
    apply(app: Application): void
}
