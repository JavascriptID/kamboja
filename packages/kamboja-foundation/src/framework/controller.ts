import { HttpRequest, BaseController, Handshake, Validator, InvocationBase } from "kamboja-core";
import { ValidatorImpl } from "../validator"

export class Controller implements BaseController {
    private validatorImpl: ValidatorImpl;
    invocation: InvocationBase
    request: HttpRequest 
    handshake: Handshake

    get validator(): Validator {
        if (!this.validatorImpl)
            this.validatorImpl = ValidatorImpl.create()

        this.validatorImpl.setValue(
            this.invocation.parameters,
            this.invocation.controllerInfo!.classMetaData!,
            this.invocation.controllerInfo!.methodMetaData!.name)
        return this.validatorImpl
    }
}

