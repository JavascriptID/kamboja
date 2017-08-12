import { MethodMetaData, ClassMetaData } from "kecubung";

export interface ControllerInfo {
    methodMetaData?: MethodMetaData
    classMetaData?: ClassMetaData
    qualifiedClassName?: string
    classId?: any
}