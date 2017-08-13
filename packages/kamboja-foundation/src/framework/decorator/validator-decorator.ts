
export class ValidatorDecorator {
    required(message?: string) { return (...args: any[]) => { }; }
    range(min: number, max?: number, message?: string) { return (...args: any[]) => { }; }
    email(message?: string) { return (...args: any[]) => { }; }
}

export const val = new ValidatorDecorator();