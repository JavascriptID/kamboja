import { MiddlewareDecorator as Decorator, Core} from "kamboja-foundation"
import { RequestHandler } from "express"
import { ExpressMiddlewareAdapter } from "./express-middleware-adapter"

export class MiddlewareDecorator {

    private middleware:Decorator = new Decorator()
    
    use(middleware: RequestHandler | string | Core.Middleware) {
        if (typeof middleware == "function")
            return this.middleware.use(new ExpressMiddlewareAdapter(middleware))
        else
            return this.middleware.use(middleware)
    }

    id(id:string){
        return this.middleware.id(id)
    }
}

export const middleware = new MiddlewareDecorator();