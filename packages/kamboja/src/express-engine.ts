import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"
import { Core, Kernel, HttpStatusError } from "kamboja-foundation"
import * as Express from "express"
import * as Http from "http";
import * as Lodash from "lodash"
import * as Fs from "fs"
import * as Chalk from "chalk"

function route(handler: Kernel.RequestHandler) {
    return (req: Express.Request, resp: Express.Response, next: Express.NextFunction) => {
        handler.execute(new RequestAdapter(req), new ResponseAdapter(resp, next));
    }
}

function notFound(handler: Kernel.RequestHandler) {
    return (req: Express.Request, resp: Express.Response, next: Express.NextFunction) => {
        handler.execute(new RequestAdapter(req), new ResponseAdapter(resp, next),
        new HttpStatusError(404, "Requested url not found"));
    }
}

function error(handler: Kernel.RequestHandler) {
    return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        handler.execute(new RequestAdapter(req), new ResponseAdapter(res, next), err);
    }
}

export class ExpressEngine implements Core.Engine {
    middlewares: Express.RequestHandler[] = []
    settings: { [key: string]: any } = {}

    addMiddleware(mdw:Express.RequestHandler){
        this.middlewares.push(mdw)
    }

    addSetting(key:string, value:any){
        this.settings[key] = value;
    }

    init(routes: Core.RouteInfo[], option: Core.KambojaOption, app?: any) {
        let application = app || Express();
        for(let key in this.settings){
            application.set(key, this.settings[key])
        }

        for(let mdw of this.middlewares){
            application.use(mdw)
        }

        //routes
        routes.forEach(info => (<any>application)[info.httpMethod!.toLowerCase()]
            (info.route, route(new Kernel.RequestHandler(option, info))))

        //rest of the unhandled request and 404 handler
        application.use(notFound(new Kernel.RequestHandler(option)))

        //error handler
        application.use(error(new Kernel.RequestHandler(option)))

        if(app) return application
        else return Http.createServer(application)
    }
}



