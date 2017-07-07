export { ValidatorImpl } from "./validator"
export { decoratorName, ValidatorBase, ValidatorDecorator  } from "./baseclasses"
export { RequiredValidator } from "./required-validator"
export { RangeValidator } from "./range-validator"
export { EmailValidator } from "./email-validator"
export { TypeValidator } from "./type-validator"
import * as Core from "kamboja-core"

export function resolve(commands: (string | Core.ValidatorCommand)[], resolver:Core.DependencyResolver) {
    let validators:Core.ValidatorCommand[] = []
    if(!commands) return validators;
    commands.forEach(x => {
        if (typeof x == "string") {
            try {
                let validator = resolver.resolve<Core.ValidatorCommand>(x)
                validators.push(validator)
            }
            catch (e) {
                throw new Error(`Can not instantiate custom validator [${x}]`)
            }
        }
        else validators.push(x)
    })
    return validators
}