import { val, type } from "../../../src"
import { ItemModel } from "./item-model"
export class UserModel {
    @val.email()
    @val.required()
    email: string

    @val.required()
    displayName: string

    @type("ItemModel, not/valid/item/path")
    item: ItemModel 
}