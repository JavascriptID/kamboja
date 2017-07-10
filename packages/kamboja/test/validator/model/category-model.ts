import { val, type } from "../../../src"
import { ItemModel } from "./item-model"

export class CategoryModel {
    @val.required()
    name: string

    @type("ItemModel[], model/item-model")
    items: ItemModel[]
}