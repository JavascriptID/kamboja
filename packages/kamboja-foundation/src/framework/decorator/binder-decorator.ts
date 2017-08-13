
export class BinderDecorator {
    body() { return (target: any, propertyKey: string, index: number) => { }; }
    cookie(name?: string) { return (target: any, propertyKey: string, index: number) => { }; }
}

export const bind = new BinderDecorator()