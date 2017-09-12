import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"
import { Core, Kernel, HttpStatusError } from "kamboja-foundation"
import * as Express from "express"
import * as Http from "http";
import * as Lodash from "lodash"
import * as Fs from "fs"
import * as Chalk from "chalk"

function route(handler: Kernel.RequestHandler) {
    return async (req: Express.Request, resp: Express.Response, next: Express.NextFunction) => {
        await handler.execute(new RequestAdapter(req), new ResponseAdapter(resp, next),
            new Kernel.ControllerInvocation());
    }
}

function notFound(handler: Kernel.RequestHandler) {
    return async (req: Express.Request, resp: Express.Response, next: Express.NextFunction) => {
        await handler.execute(new RequestAdapter(req), new ResponseAdapter(resp, next),
            new Kernel.ErrorInvocation(new HttpStatusError(404, "Requested url not found")));
    }
}

function error(handler: Kernel.RequestHandler) {
    return async (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        await handler.execute(new RequestAdapter(req), new ResponseAdapter(res, next),
            new Kernel.ErrorInvocation(new HttpStatusError(err)));
    }
}

export class ExpressEngine implements Core.Engine {
    application: Express.Application

    constructor() {
        this.application = Express();
    }

    init(routes: Core.RouteInfo[], option: Core.KambojaOption) {
        //routes
        routes.forEach(info => (<any>this.application)[info.httpMethod!.toLowerCase()]
            (info.route, route(new Kernel.RequestHandler(option, info))))

        //rest of the unhandled request and 404 handler
        this.application.use(notFound(new Kernel.RequestHandler(option)))

        //error handler
        this.application.use(error(new Kernel.RequestHandler(option)))
        return this.application;
    }
}



