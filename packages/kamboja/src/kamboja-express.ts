import { Kamboja } from "kamboja-foundation"
import { ExpressEngine } from "./express-engine"
import { ExpressMiddlewareAdapter } from "./express-middleware-adapter"
import { RequestHandler } from "express"
import { MiddlewareDecorator, MiddlewareCallback } from "./middleware-decorator"
import { Server } from "http"
import * as Core from "kamboja-core"

export type KambojaOptionKeys = keyof Core.KambojaOption
export type ExpressOptionKeys = "case sensitive routing" | "env" | "etag"
    | "json replacer" | "json spaces" | "query parser" | "trust proxy"
    | "views" | "view cache" | "view engine" | "x-powered-by"
export type OptionKeys = KambojaOptionKeys | ExpressOptionKeys

export class KambojaApplication {
    private expressEngine: ExpressEngine;
    private kamboja: Kamboja;

    constructor(opt: string | Core.KambojaOption) {
        this.expressEngine = new ExpressEngine();
        this.kamboja = new Kamboja(this.expressEngine, opt)
    }

    set(setting: OptionKeys, value: any) {
        switch (setting) {
            case "case sensitive routing":
            case "env":
            case "etag":
            case "json replacer":
            case "json spaces":
            case "query parser":
            case "trust proxy":
            case "views":
            case "view cache":
            case "view engine":
            case "x-powered-by":
                this.expressEngine.addSetting(setting, value)
                break;
            default:
                this.kamboja.set(setting, value)
        }
        return this;
    }

    get<T>(setting: keyof Core.KambojaOption) {
        return this.kamboja.get<T>(setting)
    }

    apply(facility: Core.Facility | string) {
        this.kamboja.apply(facility)
        return this;
    }

    useExpress(middleware: RequestHandler) {
        this.expressEngine.addMiddleware(middleware)
        return this
    }

    use(middleware: MiddlewareCallback | string | Core.Middleware) {
        this.kamboja.use(middleware)
        return this
    }

    init(app?: any): Server {
        return this.kamboja.init(app);
    }
}

export function application(opt: string | Core.KambojaOption) {
    return new KambojaApplication(opt)
}