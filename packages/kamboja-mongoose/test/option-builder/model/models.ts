import { val, type } from "kamboja"
import { mongoose } from "../../../src"

export class WithoutProperties{
    name:string
}

export class ByConvention {
    @type("date")
    createdAt: Date
    @type("date")
    updatedAt: Date
}

export class ByDecorator {
    @mongoose.timestamp("createdAt")
    @type("date")
    createdOn: Date
    @mongoose.timestamp("updatedAt")
    @type("date")
    updatedOn: Date
}

export class OnlyCreatedOn{
    @type("date")
    createdAt: Date    
}

export class OnlyUpdatedOn {
    @type("date")
    updatedAt: Date    
}

export class DuplicateDecoratorCreatedOn{
    @mongoose.timestamp("createdAt")
    createdOn:Date
    @mongoose.timestamp("createdAt")
    createTime:Date
}

export class DuplicateCreatedOn{
    @mongoose.timestamp("createdAt")
    @type("date")
    createdOn:Date
    @type("date")
    createdAt:Date
}

export class DuplicateDecoratorUpdatedOn{
    @mongoose.timestamp("updatedAt")
    updatedOn:Date
    @mongoose.timestamp("updatedAt")
    updateTime:Date
}

export class DuplicateUpdatedOn{
    @mongoose.timestamp("updatedAt")
    @type("date")
    updatedOn:Date
    @type("date")
    updatedAt:Date
}