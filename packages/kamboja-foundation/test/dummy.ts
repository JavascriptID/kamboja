import { route } from "../src"
import { Controller, ApiController } from "../src/controller"

export class MyModel {
    myProp: string
}

export class MyController extends Controller {

    @route.get()
    getByPage(model:any) {}
}