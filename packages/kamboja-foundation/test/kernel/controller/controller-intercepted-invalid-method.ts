import { Controller, middleware } from "../../../src"

export class UnQualifiedNameOnMethodController extends Controller {

    @middleware.use("UnqualifiedName, path/of/nowhere")
    returnView() {
        return "Helow"
    }
}