import { Controller } from "kamboja-foundation"
import { middleware } from "../../../src"
import * as Model from "../model/user-model"
import * as Express from "express"

@middleware.useExpress((req, res, next) => {
    res.status(501)
    res.end()
})
export class ClassScopedMiddlewareController extends Controller {
    index() {
        return "Hello!"
    }

    otherIndex() {
        return "Hello!"
    }
}

export class MethodScopedMiddlewareController extends Controller {
    @middleware.useExpress((req, res: Express.Response, next) => {
        res.status(501)
        res.end()
    })
    index() {
        return "Hello!"
    }

    otherIndex() {
        return "Hello!"
    }
}