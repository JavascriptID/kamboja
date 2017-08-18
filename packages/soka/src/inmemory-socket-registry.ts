import {SocketRegistry} from "kamboja-core"

export class InMemorySocketRegistry implements SocketRegistry {
    data: {[key:string]:string} = {}

    async register(id: string, alias: string): Promise<void> {
        this.data[alias] = id;
    }

    async lookup(alias: string): Promise<string> {
        return this.data[alias]
    }
}