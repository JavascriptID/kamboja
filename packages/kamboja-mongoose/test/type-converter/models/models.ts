import { val, type } from "kamboja"
import { mongoose } from "../../../src"

@mongoose.shortid()
export class ShortModel {
    @type("string")
    name:string
}

export class DefaultIdModel{
    @type("string")
    name:string
}

export class ParentModel {
    @type("string")
    name:string

    @type("ShortModel, models/models")
    short:ShortModel

    @type("DefaultIdModel, models/models")
    defaultId:DefaultIdModel
}