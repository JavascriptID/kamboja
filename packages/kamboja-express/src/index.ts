export { KambojaApplication, OptionKeys } from "./kamboja-express"
export { MiddlewareActionResult } from "./middleware-action-result"
export { ViewActionResult} from "./view-action-result"
export { JsonActionResult} from "./json-action-result"
export { RedirectActionResult} from "./redirect-action-result"
export { FileActionResult} from "./file-action-result"
export { DownloadActionResult} from "./download-action-result"
export { ExpressMiddlewareAdapter } from "./express-middleware-adapter"
export {
    ApiController, authorize, Controller, SocketController, Core, http, HttpStatusError,
    internal, MetaDataLoader, Middleware, RequestHandler, Resolver, RouteGenerator, val, 
    Validator, bind, type, route
} from "kamboja"

import {ActionResults} from "./action-results"
import { MiddlewareMetaData } from "./middleware-metadata"
export const middleware: MiddlewareMetaData = new MiddlewareMetaData()
export const response:ActionResults = new ActionResults()
