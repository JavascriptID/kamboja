import { Middleware } from "../framework/middleware"
import { DecoratorHelper } from "./decorator-helper"

export const MethodDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }
export type DecoratorType = keyof HttpDecorator;
export const MiddlewareMetadataKey = "kamboja:middleware"
export const MiddlewareIdMetadataKey = "kamboja:middleware:id"
export { DecoratorHelper }

export class HttpDecorator {
    ignore() { return MethodDecorator }
    root(route: string) { return (constructor: Function) => { } }
    get(route?: string) { return MethodDecorator }
    post(route?: string) { return MethodDecorator }
    put(route?: string) { return MethodDecorator }
    patch(route?: string) { return MethodDecorator }
    delete(route?: string) { return MethodDecorator }
    on(event: string) { return MethodDecorator }
}

export class BinderDecorator {
    body() { return (target: any, propertyKey: string, index: number) => { }; }
    cookie(name?: string) { return (target: any, propertyKey: string, index: number) => { }; }
}

export class MiddlewareDecorator {
    use(middleware: Middleware | string) {
        return (...args: any[]) => {
            DecoratorHelper.save(MiddlewareMetadataKey, middleware, args)
        }
    }
    id(id: string) {
        return (...args: any[]) => {
            DecoratorHelper.save(MiddlewareIdMetadataKey, id, args)
        }
    }
}

export function reflect(obj: any) {
    //dynamic
    let dynamicProperties = Object.getOwnPropertyNames(obj)
    let staticProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    return dynamicProperties.concat(staticProperties.filter(x => x != "constructor"))
}

export const middleware = new MiddlewareDecorator()
export const route = new HttpDecorator()
export const bind = new BinderDecorator();
export function type(typ: string) { return (...target: any[]) => { }; }