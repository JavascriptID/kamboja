import * as Core from "kamboja-core"

export namespace ValidatorFactory {
    export function resolve(commands: (string | Core.ValidatorCommand)[], resolver:Core.DependencyResolver) {
        let validators:Core.ValidatorCommand[] = []
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
}