
export interface PathResolver {
    resolve(path: string): string
    relative(absolute: string): string
    normalize(path: string): string
}