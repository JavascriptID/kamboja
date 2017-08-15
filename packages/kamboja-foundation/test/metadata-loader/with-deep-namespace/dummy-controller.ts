import { Controller } from "../../../src"

export namespace MyParentNamespace {
    export namespace MyChildNamespace {
        export class DummyController extends Controller {
            getData(offset:number, pageSize:number) { }
        }
    }
}
