
export interface SocketRegistry {
    register(id: string, alias: string): Promise<void>
    lookup(alias: string): Promise<string>
}
