import { MiddlewareDecorator as Decorator, CallbackMiddleware} from "kamboja-foundation"
import { RequestHandler } from "express"
import { ExpressMiddlewareAdapter } from "./express-middleware-adapter"
import * as Core from "kamboja-core"

export class MiddlewareDecorator {
    static isExpressMiddleware(middleware: RequestHandler | Core.MiddlewaresType): middleware is RequestHandler{
        return typeof middleware == "function" && middleware.length == 3
    }

    private middleware:Decorator = new Decorator()
    
    use(middleware: Core.MiddlewareFunction | RequestHandler | Core.Middleware | string) {
        if (MiddlewareDecorator.isExpressMiddleware(middleware))
            return this.middleware.use(new ExpressMiddlewareAdapter(middleware))
        else
            return this.middleware.use(middleware)
    }

    

    id(id:string){
        return this.middleware.id(id)
    }
}

export const middleware = new MiddlewareDecorator();