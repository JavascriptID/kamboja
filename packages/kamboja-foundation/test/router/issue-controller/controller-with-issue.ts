import {Controller} from "../../../src"

class NonExported extends Controller{
    getData(offset:number, pageSize:number){}
}

export class ExportedButNotInheritedController{
    getData(offset:number, pageSize:number){}
}

export class ValidController extends Controller{
    getData(offset:number, pageSize:number){}
}