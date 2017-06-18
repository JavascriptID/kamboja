import { ApiController, val } from "../../../src"

export class DummyApi extends ApiController {
    get(id:string) {
        return id
    }

    list(iOffset:number, iLimit:number) {
        return {
            iOffset:iOffset,
            iLimit:iLimit
        }
    }

    add(data:any) {
        return data
    }

    replace(id:string, data:any) {
        return { id: id, data: data }
    }

    modify(id:string, data:any) { 
        return { id: id, data: data }
    }

    delete(id:string) { 
        return id
    }
}