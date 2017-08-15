import { FieldValidatorArg } from "./field-validator-arg";
import { ValidationError } from "./validation-error";

export interface ValidatorCommand {
    validate(args: FieldValidatorArg): ValidationError[] | undefined
}
