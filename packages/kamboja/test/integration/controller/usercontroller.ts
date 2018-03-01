import { route, Controller } from "kamboja-foundation"
import * as Model from "../model/user-model"
import { Request, Response, NextFunction } from "express"
import { middleware, JsonActionResult } from "../../../src"
import { Return400Middleware } from "../interceptor/400-middleware"
import { view } from "../../../src"
import { authenticate } from "passport"
import * as Core from "kamboja-core"

let Middleware = (req: Request, res: Response, next: NextFunction) => {
    res.status(401)
    res.end()
}

export class UserController extends Controller {
    index()  {
        return view()
    }

    hasError() {
        throw new Error("This user error")
    }



    @route.get("with/:id")
    withParam(id: string, iAge: number, bGraduated: boolean) {
        return { id: id, age: iAge, graduated: bGraduated }
    }

    @middleware.use(new Return400Middleware())
    withMiddleware():Core.ActionResult {
        return view()
    }

    setHeader() {
        let result = new Core.ActionResult({})
        result.header = { Accept: "text/xml" }
        return result;
    }

    @middleware.useExpress((req, res, next) => {
        res.setHeader("custom-header", "hello")
        next()
    })
    expressMiddlewareChain() {
        return "Hello"
    }

    @middleware.useExpress((req, res, next) => {
        next(new Error("USER ERROR"))
    })
    expressMiddlewareSendError() {
        return "Hello"
    }

    @middleware.useExpress((req, res, next) => {
        setTimeout(function () {
            res.setHeader("custom-header", "hello")
            next()
        }, 100);
    })
    expressMiddlewareAsync() {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve("Hello")
            }, 500);
        })
    }

    @middleware.useExpress((req, res, next) => {
        setTimeout(function () {
            res.setHeader("custom-header", "hello")
            res.send("Not Hello")
        }, 100);
    })
    expressMiddlewareAsyncBypassAction() {
        return "Hello"
    }

    @middleware.useExpress((req, res, next) => {
        res.setHeader("custom-header", "hello")
        next()
    })
    expressMiddlewareWithErrorAction() {
        throw new Error("Internal Error")
    }

    @middleware.useExpress((req, res, next) => {
        req.user = { name: "Nobita" }
        next()
    })
    expressMiddlewareModifyUser() {
        return new JsonActionResult(this.request.user)
    }

    @middleware.use(async (context:Core.HttpRequest, next:Core.Invocation) => {
        return new JsonActionResult({}, 501)
    })
    kambojaCallbackMiddleawre(){
        return new JsonActionResult({})
    }
}