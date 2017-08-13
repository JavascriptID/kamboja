import {Controller} from "../../../src"

export class DummyController extends Controller {
    index(){
        return "Hello world!"
    }
}