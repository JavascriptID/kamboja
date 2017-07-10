import * as Validator from "./validator"
import * as Core from "kamboja-core"
import * as Resolver from "./resolver"
import * as RouteGenerator from "./route-generator"
import * as Kecubung from "kecubung"
import * as Middleware from "./middleware"

export { Validator }
export { Core }
export { Resolver }
export { RouteGenerator }
export { Middleware }
export { ApiController, Controller, HttpStatusError, Controllers } from "./controller"
export { Kamboja } from "./kamboja"
export { MetaDataLoader } from "./metadata-loader/metadata-loader"
export { RequestHandler } from "./engine"

//decorators
const middleware: Middleware.MiddlewareDecorator = new Middleware.MiddlewareDecorator()
export const val: Validator.ValidatorDecorator = new Validator.ValidatorDecorator();
export const internal = new Core.Decorator().internal;

/**
 * @deprecated use route
 */
export const http = new Core.HttpDecorator();
export const route = new Core.HttpDecorator();
export const bind = new Core.BinderDecorator();
export function authorize(role?: string | string[]) {
    return middleware.use(new Middleware.Authorize(role!))
}
