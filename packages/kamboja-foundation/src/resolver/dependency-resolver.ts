import * as Core from "kamboja-core"
import { DefaultPathResolver } from "./path-resolver"
import { QualifiedName } from "./qualified-name"

export class DefaultDependencyResolver implements Core.DependencyResolver {
    static classes: { [id: string]: any } = {}

    constructor(private idResolver: Core.IdentifierResolver, private pathResolver: Core.PathResolver) { }

    resolve<T>(id: string) {
        let cache = DefaultDependencyResolver.classes[id];
        if(cache) return new cache()
        let name = this.idResolver.getClassName(id)
        let qualified = new QualifiedName(name, this.pathResolver)
        let instance = require(this.pathResolver.resolve(qualified.fileName))
        let classParts = qualified.className.split(".")
        classParts.forEach(x => instance = instance[x.trim()])
        DefaultDependencyResolver.classes[id] = instance;
        return <T>new instance();
    }
}