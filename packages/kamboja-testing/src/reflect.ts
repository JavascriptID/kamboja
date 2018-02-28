export function reflect(obj: any) {
    const deepProps = (x: any): string[] => <string[]>(x && x !== Object.prototype && Object.getOwnPropertyNames(x).concat(deepProps(Object.getPrototypeOf(x)) || []));
    //const deepFunctions = (x: any) => deepProps(x).filter(name => typeof x[name] === "function");
    return deepProps(obj).filter(name => name !== "constructor" && !~name.indexOf("__"));
}