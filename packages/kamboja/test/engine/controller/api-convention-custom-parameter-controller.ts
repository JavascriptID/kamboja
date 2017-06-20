import { ApiController, val } from "../../../src"

export class DummyApi extends ApiController {
    get(id:string, root:any) {
        return {
            id: id,
            root: root
        }
    }

    list(iOffset:number, iLimit:number, root:any) {
        return {
            iOffset: iOffset,
            iLimit: iLimit,
            root: root
        }
    }

    add(data:any, root:any) {
        return {
            data: data,
            root: root
        }
    }

    replace(id:string, data:any, root:any) {
        return {
            id: id,
            data: data,
            root: root
        }
    }

    modify(id:string, data:any, root:any) {
        return {
            id: id,
            data: data,
            root: root
        }
    }

    delete(id:string, root:any) {
        return {
            id: id,
            root: root
        }
    }
}