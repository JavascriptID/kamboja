import {Controller, ApiController} from "../../../src"

export class DummyApi extends ApiController{
    list(offset:number, pageSize:null){}
    get(id:string){}
    add(body:any){}
    replace(id:string, body:any){}
    modify(id:string, body:any){}
    delete(id:string){}
}