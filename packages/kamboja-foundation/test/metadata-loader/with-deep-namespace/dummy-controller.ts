import { Controller, ApiController } from "../../../src/controller"

export namespace MyParentNamespace {
    export namespace MyChildNamespace {
        export class DummyController extends Controller {
            getData(offset:number, pageSize:number) { }
        }
    }
}
