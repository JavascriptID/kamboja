import { Controller } from "../../../src"
import { UserModel } from "../model/user-model"
import { CategoryModel } from "../model/category-model"
import { val, type } from "../../../src"

export function otherDecorator() {
    return function (...args:any[]) { }
}

export class UserController extends Controller {
    saveUser( @type("UserModel, model/user-model") user: UserModel) { }
    noValidator(user:any) { }
    customDecorator( @otherDecorator() user:any) { }
    missTypedModel( @type("UserModel, not/valid/path") user: UserModel) { }
    nestedError( @type("UserModel, model/fail-user-model") user: UserModel) { }
    notSpecifiedClassName( @type("") user:any) { }
    invalidClassName( @type("NonValidClassName") user:any) { }
    primitiveType( @type("string") str:string, @type("number") num:number, @type("boolean") bool:boolean) { }
    nestedWithArray( @type("CategoryModel, model/category-model") category: CategoryModel){}
}