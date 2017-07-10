import { val, type } from "kamboja"
import { Document, Schema } from "mongoose"
import { mongoose } from "../../../src"

export class UserModel {
    @type("string")
    email: string

    @type("string")
    displayName: string

    @type("date")
    dateOfBirth: Date

    @type("number")
    rate: number

    @type("date")
    createdAt: Date
}

export class CategoryModel {
    @type("string")
    name: string
}

export class ItemModel {
    @type("string")
    name: string

    @type("CategoryModel, models/index")
    category: CategoryModel | Schema.Types.ObjectId

    @type("UserModel, models/index")
    createdBy: UserModel | Schema.Types.ObjectId
}

@mongoose.shortid()
export class ProductModel {
    @type("string")
    name: string
}

export class ParentProductModel{
    @type("string")
    name: string

    @type("ProductModel, models/index")
    child:ProductModel
}

export class ParentMultiChildModel{
    @type("string")
    name: string

    @type("ProductModel[], models/index")
    child:ProductModel[]
}