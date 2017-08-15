export function reflect(obj: any) {
    //dynamic
    let dynamicProperties = Object.getOwnPropertyNames(obj)
    let staticProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    return dynamicProperties.concat(staticProperties.filter(x => x != "constructor"))
}