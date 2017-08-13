
export class ValidatorDecorator {
    required(message?: string) { return (...args: any[]) => { }; }
    range(min: number, max?: number, message?: string) { return (...args: any[]) => { }; }
    /**
     * @deprecated use type instead of val.type
     * @param qualifiedName 
     */
    type(qualifiedName: string) { console.log("@val.type() is deprecated now, use @type()"); return (...args: any[]) => { }; }
    email(message?: string) { return (...args: any[]) => { }; }
}

export const val = new ValidatorDecorator();