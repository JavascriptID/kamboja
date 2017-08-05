import { MetaData, ParentMetaData, MetadataType, MethodMetaData, ClassMetaData } from "kecubung";
import * as Kecubung from "kecubung"
import * as Url from "url"
import "reflect-metadata"
import * as Http from "http"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "EVENT"
export type TransformStatus = "ExitWithResult" | "Next" | "Exit"
export type TransformerName = "DefaultAction" | "IndexAction" | "HttpMethodDecorator" | "ApiConvention" | "InternalDecorator" | "Controller" | "ControllerWithDecorator" | "Module"
export type MetaDataLoaderCategory = "Controller" | "Model"
export const ValidationTypesAccepted = ["string", "string[]", "number", "number[]", "boolean", "boolean[]", "date", "date[]"]
export type LogType = "Info" | "Warning" | "Error" | "None"

export type MiddlewaresType = string | string[] | Middleware | Middleware[]
export type MiddlewareFactory = (opt: KambojaOption) => MiddlewaresType

export const MethodDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }

export class Decorator {
    /**
     * Add type metadata information 
     * @param typ Qualified name of the type
     */
    type(typ: string) { return (...target: any[]) => { }; }

    /**
     * Listen to real time event
     * @param event event name
     */
    listen(event: string) { return MethodDecorator }
}

export class HttpDecorator {
    ignore() { return MethodDecorator }
    root(route: string) { return (constructor: Function) => { } }
    get(route?: string) { return MethodDecorator }
    post(route?: string) { return MethodDecorator }
    put(route?: string) { return MethodDecorator }
    patch(route?: string) { return MethodDecorator }
    delete(route?: string) { return MethodDecorator }
    on(event: string) { return MethodDecorator }
}


export class BinderDecorator {
    body() { return (target: any, propertyKey: string, index: number) => { }; }
    cookie(name?: string) { return (target: any, propertyKey: string, index: number) => { }; }
}

export type DecoratorType = keyof Decorator | keyof HttpDecorator;


export namespace RouteAnalysisCode {

    /**
     * Issue when route parameters doesn't have association
     * with action parameters
     */
    export const UnAssociatedParameters = 1;

    /**
     * Only applied on GET method, issue when action contains parameter
     * but route doesn't have any
     */
    export const MissingRouteParameters = 2;

    /**
     * Issue when router contains parameter, but action doesn't have any
     */
    export const MissingActionParameters = 3;

    /**
     * Issue when @internal decorator combined with other http method decorator
     */
    export const ConflictDecorators = 4;

    /**
     * API Convention fail because appropriate method name is match with
     * method naming convention but the method doesn't have parameters
     */
    export const ConventionFail = 5;

    export const ClassNotInheritedFromController = 6

    export const ClassNotExported = 7

    export const DuplicateRoutes = 8

    export const DuplicateParameterName = 9
    export const QueryParameterNotAllowed = 10
    export const DecoratorNotAllowed = 11
}

export interface AnalysisMessage {
    code: number
    type: "Error" | "Warning"
    message: string
}

/**
 * ask the next transformer to override each of field if possible
 */
export enum OverrideRequest {
    Route = 1,
    HttpMethod = 2,
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

export interface TransformResult {
    status: TransformStatus
    info?: RouteInfo[]
}

export interface FieldValidatorArg {
    value: any
    field: string
    parentField?: string
    decoratorArgs: Kecubung.ValueMetaData[]
    classInfo: Kecubung.ClassMetaData
}

export interface ValidatorCommand {
    validate(args: FieldValidatorArg): ValidationError[] | undefined
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

export interface KambojaOption extends Facade {
    skipAnalysis?: boolean
    controllerPaths?: string[]
    modelPath?: string
    rootPath: string
    showLog?: LogType
    socketEngine?: Engine

    //socket callback instance based on socket engine implementation
    socketApp?: any

    //http callback instance based on http engine implementation
    httpApp?: any
}

export interface MetaDataStorage {
    pathResolver: PathResolver
    get(classId: string): QualifiedClassMetaData | undefined
    getFiles(category: MetaDataLoaderCategory): Kecubung.ParentMetaData[]
    getClasses(category: MetaDataLoaderCategory): QualifiedClassMetaData[]
}

export interface Engine {
    init(routes: RouteInfo[], option: KambojaOption): any;
}

export interface ValidationError {
    field: string,
    message: string
}

export interface Validator {
    isValid(): boolean
    getValidationErrors(): ValidationError[] | undefined
}

export interface SocketRegistry {
    register(id: string, alias: string): Promise<void>
    lookup(alias: string): Promise<string>
}

export interface BaseController {
    validator: Validator;
}

export interface AuthUserStore {
    save(user: AuthUser): Promise<void>
    get(id: string): Promise<AuthUser>
}

export interface AuthUser {
    readonly id: string
}

export interface Handshake {
    contextType: "Handshake"
    headers: any
    id: string
    rooms: string[]
    user: AuthUser
    params: { [key: string]: string }
    getHeader(key: string): string | undefined
    getParam(key: string): string | undefined
}

export interface HttpRequest {
    contextType: "HttpRequest"
    httpVersion: string
    httpMethod: HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    user: AuthUser
    body: any
    referrer: string
    url: Url.Url
    getHeader(key: string): string | undefined
    getCookie(key: string): string | undefined
    getParam(key: string): string | undefined
    getAccepts(key: string | string[]): string | boolean
    isAuthenticated(): boolean
    getUserRole(): string
    route: string
}

export interface ControllerInfo {
    methodMetaData?: MethodMetaData
    classMetaData?: ClassMetaData
    qualifiedClassName?: string
    classId?: any
}


export interface Cookie {
    key: string
    value: string
    options?: CookieOptions
}

export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date | boolean;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | "auto";
}

export interface Response {
    send(result: ResponseResult): void
}

export interface ResponseResult {
    body: any
    status?: number
    type?: string
    header?: { [key: string]: string | string[] }
    cookies?: Cookie[]
    events?: SocketEvent[]
}

export class HttpError {
    constructor(public status: number,
        public error: any,
        public request: HttpRequest,
        public response: Response) { }
}

export abstract class Invocation {
    abstract proceed(): Promise<ActionResult>
    parameters: any[]
    controllerInfo?: RouteInfo
    middlewares?: Middleware[]
}

export interface Middleware {
    execute(context: Handshake | HttpRequest, next: Invocation): Promise<ActionResult>;
}

export interface Facility {
    apply(app: Application): void
}

export interface Application {
    use(middleware: MiddlewaresType): Application
    set(key: keyof KambojaOption, value: any): Application
    get(key: keyof KambojaOption): any
}

export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string): T;
}

export interface IdentifierResolver {
    getClassId(qualifiedClassName: string): string
    getClassName(classId: string): string
}

export interface PathResolver {
    resolve(path: string): string
    relative(absolute: string): string
    normalize(path: string): string
}

export interface SocketEvent {
    type: "Broadcast" | "Private" | "Room"
    name: string
    id?: string | string[]
    payload?: any
}

export class ActionResult implements ResponseResult {
    header: { [key: string]: string | string[] } = {}
    cookies?: Cookie[]
    events?: SocketEvent[]

    constructor(public body: any, public status?: number, public type?: string) { }

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

    async execute(context: HttpRequest | Handshake, response: Response, routeInfo?: RouteInfo) {
        response.send(this)
    }
}

export function getRouteDetail(info: RouteInfo) {
    const tokens = info.qualifiedClassName!.split(",")
    const method = `${tokens[0].trim()}.${info.methodMetaData!.name}`
    const file = tokens[1].trim()
    return `[${method} ${file}]`;
}

export interface QualifiedClassMetaData extends Kecubung.ClassMetaData {
    qualifiedClassName: string
}

export namespace MetaDataHelper {
    export function save(key: string, value: any, args: any[]) {
        if (args.length == 1) {
            let collections = Reflect.getMetadata(key, args[0]) || []
            collections.push(value);
            Reflect.defineMetadata(key, collections, args[0])
        }
        else {
            let collections = Reflect.getMetadata(key, args[0], args[1]) || []
            collections.push(value);
            Reflect.defineMetadata(key, collections, args[0], args[1])
        }
    }

    export function get<T>(key: string, target: any, methodName?: string) {
        if (!target) return []
        if (!methodName) {
            let collections: T[] = Reflect.getMetadata(key, target.constructor)
            return collections
        }
        else {
            let collections: T[] = Reflect.getMetadata(key, target, methodName)
            return collections
        }
    }
}

export function reflect(obj: any) {
    //dynamic
    let dynamicProperties = Object.getOwnPropertyNames(obj)
    let staticProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    return dynamicProperties.concat(staticProperties.filter(x => x != "constructor"))
}