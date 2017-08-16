import * as Chai from "chai"
import { ValidatorDecorator, Validator,  } from "../../src"
import {FieldValidatorArg} from "kamboja-core"
describe("Validator Base Classes", () => {
    it("Instantiate Validator Decorator properly", () => {
        let decorator = new ValidatorDecorator();
        let email = decorator.email()
        email()
        let range = decorator.range(1)
        range(1)
        let required = decorator.required()
        required()
    })

    describe("ValidatorBase", () => {
        it("Should instantiate validator base properly", () => {
            let validator = new Validator.ValidatorBase();
            validator.validate(<FieldValidatorArg>{})
        })

        it("Should identify empty object properly", () => {
            let validator = new Validator.ValidatorBase();
            Chai.expect(validator.isEmpty(null)).true
            Chai.expect(validator.isEmpty(undefined)).true
            Chai.expect(validator.isEmpty("")).true
            Chai.expect(validator.isEmpty("     ")).true
        })
    })


})