export { Application, BaseController, Engine, Facility, Invocation, KambojaOption, LogType, MethodDecorator, Middleware, MiddlewaresType, Response } from "./framework"
export { Cookie, CookieOptions, HttpError, HttpMethod, HttpRequest } from "./http"
export { DependencyResolver, IdentifierResolver, PathResolver } from "./resolver"
export { AnalysisMessage, ControllerInfo, MetaDataLoaderCategory, MetaDataStorage, OverrideRequest, QualifiedClassMetaData, RouteAnalysisCode, TransformerName, TransformStatus } from "./router"
export { AuthUser, AuthUserStore } from "./security"
export { Handshake, SocketEvent, SocketRegistry } from "./socket"
export { FieldValidatorArg, ValidationTypesAccepted, Validator } from "./validator"

/*
definition & classes below just a hack to pass TypeScript compilation error.
Ideally all class should separated into files for easier to identify & categorized
*/

import { Cookie, CookieOptions, HttpRequest, HttpMethod } from "./http";
import { Handshake, SocketEvent } from "./socket";
import { Response, Middleware, Facility } from "./framework";
import { TransformerName, OverrideRequest, MetaDataStorage, TransformStatus } from "./router";
import { MethodMetaData, ClassMetaData } from "kecubung";
import { DependencyResolver, IdentifierResolver, PathResolver } from "./resolver"
import { ValidatorCommand, FieldValidatorArg } from "./validator"
import { AuthUserStore } from "./security"

export class ActionResult {
    engine: "Express" | "General"
    header: { [key: string]: string | string[] } = {}
    cookies?: Cookie[]
    events?: SocketEvent[]

    constructor(public body: any, public status?: number, public type?: string) {
        this.engine = "General"
    }

    setHeader(key: string, value: string | string[]) {
        this.header[key] = value;
        return this
    }

    setCookie(key: string, value: string, options?: CookieOptions) {
        if (!this.cookies) this.cookies = []
        this.cookies.push({ key: key, value: value, options: options })
        return this
    }

    setStatus(status: number) {
        this.status = status;
        return this
    }

    setType(type: string) {
        this.type = type;
        return this;
    }

    broadcast(event: string, data?: any) {
        if (!this.events) this.events = []
        this.events.push({ type: "Broadcast", name: event, payload: data || this.body })
        return this;
    }

    emit(event: string, id: string | string[], data?: any) {
        if (!this.events) this.events = []
        this.events.push({ type: "Private", id: id, name: event, payload: data || this.body })
        return this;
    }

    execute(context: HttpRequest | Handshake, response: Response, routeInfo?: RouteInfo) {
        response.send(this)
    }
}

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


export interface Facade {
    dependencyResolver?: DependencyResolver
    identifierResolver?: IdentifierResolver
    pathResolver?: PathResolver
    validators?: (ValidatorCommand | string)[]
    metaDataStorage?: MetaDataStorage
    middlewares?: (Middleware | string)[]
    autoValidation?: boolean
    authUserStore?: AuthUserStore
    routeInfos?: RouteInfo[]
    facilities?: Facility[]
}


export interface TransformResult {
    status: TransformStatus
    info?: RouteInfo[]
}


export interface ValidatorCommand {
    validate(args: FieldValidatorArg): ValidationError[] | undefined
}

export interface ValidationError {
    field: string,
    message: string
}
