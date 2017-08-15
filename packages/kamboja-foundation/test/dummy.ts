import { Controller, ApiController, route } from "../src"

export class MyModel {
    myProp: string
}

export class MyController extends Controller {

    @route.get()
    getByPage(model:any) {}
}