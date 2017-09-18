export interface IdentifierResolver {
    getClassId(qualifiedClassName: string): string
    getClassName(classId: string): string
}
