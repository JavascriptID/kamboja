import { Validator } from "../../../src"
import { ValidationError, FieldValidatorArg } from "kamboja-core"

export class CustomValidation extends Validator.ValidatorBase {

    @Validator.decoratorName("customValidation")
    validate(arg:FieldValidatorArg): ValidationError[] {
        return [{
            field: "any.field",
            message: "This is error"
        }]
    }
}
