import { TransformerName } from "./definition";
import { OverrideRequest } from "./override-request";
import { HttpMethod } from "../http";
import { MethodMetaData, ClassMetaData } from "kecubung";
export interface RouteInfo {
    /**
     * Transformer initiate the info
     */
    initiator?: TransformerName

    /**
     * Transformer collaborate to change the info
     */
    collaborator?: TransformerName[]

    /**
     * Message for next transformer to override specific field
     */
    overrideRequest?: OverrideRequest
    route?: string;
    httpMethod?: HttpMethod
    methodMetaData?: MethodMetaData
    classMetaData?: ClassMetaData
    qualifiedClassName?: string
    classId?: any
    analysis?: number[]
    //classPath?: string
    methodPath?: string
}
