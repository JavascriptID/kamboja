import { Controller, ApiController } from "../../../src/controller"
import { UserModel } from "../model/user-model"
import { CategoryModel } from "../model/category-model"
import { val } from "../../../src"

export function otherDecorator() {
    return function (...args:any[]) { }
}

export class UserController extends Controller {
    saveUser( @val.type("UserModel, model/user-model") user: UserModel) { }
    noValidator(user:any) { }
    customDecorator( @otherDecorator() user:any) { }
    missTypedModel( @val.type("UserModel, not/valid/path") user: UserModel) { }
    nestedError( @val.type("UserModel, model/fail-user-model") user: UserModel) { }
    notSpecifiedClassName( @val.type("") user:any) { }
    invalidClassName( @val.type("NonValidClassName") user:any) { }
    primitiveType( @val.type("string") str:string, @val.type("number") num:number, @val.type("boolean") bool:boolean) { }
    nestedWithArray( @val.type("CategoryModel, model/category-model") category: CategoryModel){}
}