export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string): T;
}
