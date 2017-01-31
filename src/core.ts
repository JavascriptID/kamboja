import { MetaData, MetadataType, MethodMetaData } from "kecubung";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export type TransformStatus = "ExitWithResult" | "Next" | "Exit"
export type TransformerName = "DefaultAction" | "HttpMethodDecorator" | "ApiConvention" | "InternalDecorator" | "Controller" | "Module"

export class Decorator {
    internal() { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}

export class HttpDecorator {
    get(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    post(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    put(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    delete(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}

export type DecoratorType = keyof Decorator | keyof HttpDecorator;

export class Validator {
    string(required = false, length?: number) { }
}

export module RouteAnalysisCode {

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

    export const ClassNotInherritedFromController = 6

    export const ClassNotExported = 7
}

export interface RouteAnalysis {
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
    className?: string
    baseClass?:string
    classId?: any
    analysis?: number[]
}

export interface TransformResult {
    status: TransformStatus
    info?: RouteInfo[]
}

export interface ClassVisitor {
    visit(meta: MetaData, parent: string): RouteInfo[]
}

export interface RequestHandler {
    routeInfo: RouteInfo
    onRequest(request: HttpRequest, response: HttpResponse);
}

export interface KambojaOption {
    engine?: Engine
    onAppSetup?: (app) => void
    controllerPaths?: string[],
    viewPath?: string,
    staticFilePath?: string,
    dependencyResolver?: DependencyResolver
    identifierResolver?: IdentifierResolver
}

export interface Engine {
    setRoutes(routes: RouteInfo[]): Engine;
    getApp(): any;
}

export interface HttpRequest {
    httpVersion: string
    httpMethod: HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    body: any
    referrer: string
    url: string
    getHeader(key: string): string
    getCookie(key: string): string
    getParam(key: string): string
}


export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date | boolean;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | 'auto';
}

export interface HttpResponse {
    setCookie(key: string, value: string, option?: CookieOptions)
    json(body, status?: number)
    jsonp(body, status?: number)
    view(name, model?)
    redirect(url: string)
    file(path: string)
}

export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string);
}

export interface IdentifierResolver {
    getClassId(qualifiedClassName: string)
}


export interface ActionResult{
    execute(response:HttpResponse);
}

const META_DATA_KEY = "kamboja:Call.when";
export function when(kind: MetadataType) {
    return function (target, method, descriptor) {
        Reflect.defineMetadata(META_DATA_KEY, kind, target, method);
    }
}

export function getWhen(target, methodName: string) {
    return <MetadataType>Reflect.getMetadata(META_DATA_KEY, target, methodName);
}

export const internal = new Decorator().internal;
export const http = new HttpDecorator();
export const val = new Validator();
