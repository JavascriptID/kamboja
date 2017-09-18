import { ValidationError } from "./validation-error";

export interface Validator {
    isValid(): boolean
    getValidationErrors(): ValidationError[] | undefined
}
