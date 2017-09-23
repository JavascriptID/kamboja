import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { ValidatorBase, getDecoratorName, ParametersValidatorArg } from "./baseclasses"
import { TypeValidator } from "./type-validator"
import { RequiredValidator } from "./required-validator"
import { EmailValidator } from "./email-validator"
import { RangeValidator } from "./range-validator"
import {Kamboja} from "../kamboja"

export class ValidatorImpl extends ValidatorBase implements Core.Validator {
    private parameters: any[]
    private classMetaData: Kecubung.ClassMetaData
    private errors: Core.ValidationError[] = []
    private methodName: string

    static create(){
        let facade = Kamboja.getFacade();
        return new ValidatorImpl(facade.metaDataStorage!, <Core.ValidatorCommand[]>facade.validators!)
    }

    constructor(private metaDataStorage: Core.MetaDataStorage,
        validators: Core.ValidatorCommand[]) {
        super()
        if (!validators) validators = []
        this.validators = validators.slice();
        let typeValidator = new TypeValidator(metaDataStorage);
        typeValidator.validators = this.validators;
        this.validators.push(typeValidator)
        this.validators.push(new EmailValidator())
        this.validators.push(new RangeValidator())
        this.validators.push(new RequiredValidator())
    }

    setValue(parameters: any[],
        meta: Kecubung.ClassMetaData, methodName: string) {
        this.parameters = parameters
        this.classMetaData = meta
        this.methodName = methodName
    }

    isValid() {
        let result = this.validateFields(<ParametersValidatorArg>{
            type: "ParametersValidator",
            classInfo: this.classMetaData,
            methodName: this.methodName,
            parameterValues: this.parameters,
        })
        if(result)
            this.errors = result;
        return this.errors.length == 0
    }

    getValidationErrors() {
        return this.errors.length > 0 ? this.errors : undefined;
    }
}