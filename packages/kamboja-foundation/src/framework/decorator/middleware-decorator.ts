import { DecoratorHelper } from "./decorator-helper";
import { Middleware, MiddlewaresType } from "kamboja-core";

export const MiddlewareMetadataKey = "kamboja:middleware"
export const MiddlewareIdMetadataKey = "kamboja:middleware:id"

export class MiddlewareDecorator {
    use(middleware: MiddlewaresType) {
        return (...args: any[]) => {
            DecoratorHelper.save(MiddlewareMetadataKey, middleware, args)
        }
    }
    id(id: string) {
        return (...args: any[]) => {
            DecoratorHelper.save(MiddlewareIdMetadataKey, id, args)
        }
    }

    static getId(target: any) {
        let result = DecoratorHelper.get<string>(MiddlewareIdMetadataKey, target)
        return result ? result[0] : undefined
    }

    static getMiddlewares(target: any, methodName?: string) {
        return DecoratorHelper.get<(MiddlewaresType)>(MiddlewareMetadataKey, target, methodName)
    }
}

export const middleware = new MiddlewareDecorator()