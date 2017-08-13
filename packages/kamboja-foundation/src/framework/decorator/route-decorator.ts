import { MethodDecorator } from "kamboja-core";

export class RouteDecorator {
    ignore() { return MethodDecorator }
    root(route: string) { return (constructor: Function) => { } }
    get(route?: string) { return MethodDecorator }
    post(route?: string) { return MethodDecorator }
    put(route?: string) { return MethodDecorator }
    patch(route?: string) { return MethodDecorator }
    delete(route?: string) { return MethodDecorator }
    on(event: string) { return MethodDecorator }
}

export const route = new RouteDecorator()