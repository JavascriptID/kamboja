import { Controller, middleware } from "../../../src"


@middleware.use("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return "Helow"
    }
}