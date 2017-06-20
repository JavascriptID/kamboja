import { ApiController, val, http } from "../../../src"

export class CategoriesController extends ApiController {
    get( @val.required() id:string) {
        return id
    }

    list(iOffset = 1, iLimit = 10, query = "") {
        return { offset: iOffset, limit: iLimit, query: query }
    }

    add(model:any) {
        return model
    }

    replace( @val.required() id:string, model:any) {
        return model
    }

    modify( @val.required() id:string, model:any) {
        return model
    }
    
    delete( @val.required() id:string) {
        return id
    }
}

@http.root("categories/:categoryId/items")
export class CategoriesItemController extends ApiController {
    get( @val.required() id:string, @val.required() categoryId:string) {
        return { id: id, categoryId: categoryId }
    }

    list( @val.required() categoryId:string, iOffset = 1, iLimit = 10, query = "") {
        return { offset: iOffset, limit: iLimit, query: query, categoryId: categoryId }
    }

    add(model:any, @val.required() categoryId:string) {
        model.categoryId = categoryId
        return model
    }

    replace( @val.required() id:string, model:any, @val.required() categoryId:string) {
        model.categoryId = categoryId
        return model
    }

    modify( @val.required() id:string, model:any, @val.required() categoryId:string) {
        model.categoryId = categoryId
        return model
    }

    delete( @val.required() id:string, @val.required() categoryId:string) {
        return { id: id, categoryId: categoryId }
    }
}