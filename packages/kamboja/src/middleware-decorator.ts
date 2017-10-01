import { MiddlewareDecorator as Decorator, CallbackMiddleware } from "kamboja-foundation"
import { RequestHandler, Request } from "express"
import { ExpressMiddlewareAdapter } from "./express-middleware-adapter"
import * as Core from "kamboja-core"

export type MiddlewareCallback = (req:Request, next:Core.Invocation) => Promise<Core.ActionResult>

export class MiddlewareDecorator {
    private middleware: Decorator = new Decorator()

    use(middleware: MiddlewareCallback | string | Core.Middleware) {
        return this.middleware.use(middleware)
    }

    useExpress(middleware: RequestHandler) {
        return this.middleware.use(new ExpressMiddlewareAdapter(middleware))
    }

    id(id: string) {
        return this.middleware.id(id)
    }
}

export const middleware = new MiddlewareDecorator();