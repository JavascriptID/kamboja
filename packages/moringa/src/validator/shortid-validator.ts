import { Validator } from "kamboja-foundation"
import * as ShortId from "shortid"
import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"

export class ShortIdValidator extends Validator.ValidatorBase{
    @Validator.decoratorName("shortid")
    validate(arg:Core.FieldValidatorArg): Core.ValidationError[]|undefined{
        if(this.isEmpty(arg.value)) return
        if(!ShortId.isValid(arg.value)){
            let argument = <Kecubung.PrimitiveValueMetaData>arg.decoratorArgs[0]
            let customMessage = argument && argument.value
            return [{
                field: arg.parentField ? `${arg.parentField}.${arg.field}` : arg.field,
                message: customMessage || `[${arg.field}] is not valid`
            }]
        }
    }
}