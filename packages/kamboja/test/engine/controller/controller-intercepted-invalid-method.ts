import { Controller } from "../../../src/controller"
import { Middleware } from "../../../src"
import { val } from "../../../src"

let middleware = new Middleware.MiddlewareDecorator()

export class UnQualifiedNameOnMethodController extends Controller {

    @middleware.use("UnqualifiedName, path/of/nowhere")
    returnView() {
        return "Helow"
    }
}