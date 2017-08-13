import { val, type } from "kamboja-foundation"

export class ReferenceEntityWithArray {
    @type("SimpleEntity[], models/simple-model")
    children: SimpleEntity[]
}

export class ReferenceEntity {
    @type("SimpleEntity, models/simple-model")
    children: SimpleEntity
}

export class SimpleEntity {
    @type("string")
    name: string
    @type("number")
    id: number
    @type("date")
    createdOn:Date
    @type("boolean")
    running:boolean
}

export class EntityWithArray{
    @type("string[]")
    name: string[]
    @type("number[]")
    id: number[]
    @type("date[]")
    createdOn:Date[]
    @type("boolean[]")
    running:boolean[]
}

export class EntityWithoutDecorator{
    age:number
    name:string
}

export class EntityMultipleDecorated{
    @type("number")
    @type("string")
    age:number
}

export class EntityWithUnsupportedType{
    @type("integer")
    age:number
}
