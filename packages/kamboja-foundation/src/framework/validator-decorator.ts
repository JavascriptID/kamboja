import { MethodDecorator } from "kamboja-core"

export class ValidatorDecorator {
    required(message?: string) { return MethodDecorator; }
    range(min: number, max?: number, message?: string) { return MethodDecorator; }
    /**
     * @deprecated use type instead of val.type
     * @param qualifiedName 
     */
    type(qualifiedName: string) { console.log("@val.type() is deprecated now, use @type()"); return MethodDecorator; }
    email(message?: string) { return MethodDecorator; }
}

export const val = new ValidatorDecorator();