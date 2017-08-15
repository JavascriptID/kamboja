import { route } from "../../../src"
import { ApiController} from "../../../src"

export class SimpleController extends ApiController {
    @route.ignore()
    getByPage(offset:number, pageWidth:number){}

    get(id:string){}
}