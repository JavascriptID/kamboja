import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"
import { Core, Engine } from "kamboja-foundation"
import * as Express from "express"
import * as Http from "http";
import * as Lodash from "lodash"
import * as Fs from "fs"
import * as Chalk from "chalk"

export class ExpressEngine implements Core.Engine {
    application: Express.Application

    constructor() {
        this.application = Express();
    }

    init(routes: Core.RouteInfo[], option: Core.KambojaOption) {
        //routes
        routes.forEach(route => {
            let method = route.httpMethod!.toLowerCase();
            (<any>this.application)[method](route.route, async (req:Express.Request, resp:Express.Response, next:Express.NextFunction) => {
                let handler = new Engine.RequestHandler(option, new RequestAdapter(req), new ResponseAdapter(resp, next), route)
                await handler.execute();
            })
        })

        //rest of the unhandled request and 404 handler
        this.application.use(async (req, resp, next) => {
            let handler = new Engine.RequestHandler(option, new RequestAdapter(req), new ResponseAdapter(resp, next))
            await handler.execute();
        })

        //error handler
        this.application.use(async (err:any, req:Express.Request, res:Express.Response, next:Express.NextFunction) => {
            let handler = new Engine.RequestHandler(option, new RequestAdapter(req), new ResponseAdapter(res, next), err)
            await handler.execute()
        })
        return this.application;
    }
}



