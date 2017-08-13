import {ApiController} from "../../../src"

export class SimpleController extends ApiController {
    list(offset:number, pageWidth:number){}
    get(id:string){}
    add(data:any){}
    replace(id:string, data:any){}
    modify(id:string, data:any){}
    delete(id:string){}
}