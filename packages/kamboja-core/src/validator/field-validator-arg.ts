import { ValueMetaData, ClassMetaData } from "kecubung";

export interface FieldValidatorArg {
    value: any
    field: string
    parentField?: string
    decoratorArgs: ValueMetaData[]
    classInfo: ClassMetaData
}