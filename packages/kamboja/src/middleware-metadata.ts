import { MiddlewareDecorator, Core} from "kamboja-foundation"
import { RequestHandler } from "express"
import { ExpressMiddlewareAdapter } from "./express-middleware-adapter"

export class MiddlewareMetaData {

    private middleware:MiddlewareDecorator = new MiddlewareDecorator()
    
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