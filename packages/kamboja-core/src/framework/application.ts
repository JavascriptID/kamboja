import { MiddlewaresType } from "./middleware";
import { KambojaOption } from "./kamboja-option";

export interface Application {
    use(middleware: MiddlewaresType): Application
    set(key: keyof KambojaOption, value: any): Application
    get(key: keyof KambojaOption): any
}