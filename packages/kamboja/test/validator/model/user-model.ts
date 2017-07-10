import { val, type } from "../../../src"
import { ItemModel } from "./item-model"
export class UserModel {
    @val.email()
    @val.required()
    @type("string")
    email: string

    @val.required()
    displayName: string

    @type("ItemModel, model/item-model")
    item: ItemModel
}