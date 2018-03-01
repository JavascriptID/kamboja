
import { BaseController, Handshake, Validator, InvocationBase } from "kamboja-core";
import { Validator as Val } from "kamboja-foundation"
import { HttpRequest } from "./request-adapter"

export class Controller implements BaseController {
    private validatorImpl: Val.ValidatorImpl;
    invocation: InvocationBase
    request: HttpRequest
    handshake: Handshake

    get validator(): Validator {
        if (!this.validatorImpl)
            this.validatorImpl = Val.ValidatorImpl.create()

        this.validatorImpl.setValue(
            this.invocation.parameters,
            this.invocation.controllerInfo!.classMetaData!,
            this.invocation.controllerInfo!.methodMetaData!.name)
        return this.validatorImpl
    }
}

