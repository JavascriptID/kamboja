import { MetaData } from "kecubung";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export type VisitStatus = "ExitWithResult" | "NextWithResult" | "Next" | "Exit"
export type GeneratingMethod = "Default" | "HttpMethodDecorator" | "ApiConvention"

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

export module RouteAnalysisCode{

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
}

export interface RouteInfo {
    generatingMethod?: GeneratingMethod
    route?: string;
    httpMethod?: HttpMethod
    parameters?: string[]
    className?: string
    methodName?: string
    classId?: any
    analysis?: number[]
}

/*remove*/
export interface MethodVisitor {
    visit(meta: MetaData, parent: string): VisitResult;
}

export interface VisitResult {
    status: VisitStatus
    result?: RouteInfo[]
}

export interface ClassVisitor {
    visit(meta: MetaData, parent: string): RouteInfo[]
}

export interface Generator {
    fileName: string,
    traverseArray(children: MetaData[], parent: string): RouteInfo[];
    traverseMeta(meta: MetaData, parent: string): RouteInfo[];
}

export interface GeneratorOption {
    stripeController?: boolean
    internalDecorator?: boolean
    httMethodDecorator?: boolean
    apiConvention?: boolean
}

export interface RequestHandler {
    routeInfo: RouteInfo
    onRequest(request: HttpRequest, response: HttpResponse);
}

export interface KambojaOption {
    engine?: Engine,
    controllerPath?: string,
    onAppSetup?: (app) => void
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
    queries: { [key: string]: string }
    body: any
    referrer: string
    url: string
    getHeader(key: string): string
    getCookie(key: string): string
    getQuery(key: string): string
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
}

export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string);
    getClassId(qualifiedClassName: string, objectInstance: any)
}

export class ApiController{
    request: HttpRequest    
}

export class Controller {
    request: HttpRequest
    view(viewName, model?){}
    redirect(url:string){}
    file(path:string){}
}

const META_DATA_KEY = "kamboja:Call.when";
export function when(kind: string) {
    return function (target, method, descriptor) {
        Reflect.defineMetadata(META_DATA_KEY, kind, target, method);
    }
}

export function getWhen(target, methodName: string) {
    return <string>Reflect.getMetadata(META_DATA_KEY, target, methodName);
}

export const internal = new Decorator().internal;
export const http = new HttpDecorator();
export const val = new Validator();
