export namespace DecoratorHelper {
    export function save(key: string, value: any, args: any[]) {
        if (args.length == 1) {
            let collections = Reflect.getMetadata(key, args[0]) || []
            collections.push(value);
            Reflect.defineMetadata(key, collections, args[0])
        }
        else {
            let collections = Reflect.getMetadata(key, args[0], args[1]) || []
            collections.push(value);
            Reflect.defineMetadata(key, collections, args[0], args[1])
        }
    }

    export function get<T>(key: string, target: any, methodName?: string) {
        if (!target) return []
        if (!methodName) {
            let collections: T[] = Reflect.getMetadata(key, target.constructor)
            return collections
        }
        else {
            let collections: T[] = Reflect.getMetadata(key, target, methodName)
            return collections
        }
    }
}