import * as Kecubung from "kecubung";
import * as Babylon from "babylon"
import * as Fs from "fs"
import * as Core from "kamboja-core"
import {Router, Resolver} from "../src"
import * as Sinon from "sinon"

export function fromFile(filePath: string, pathResolver: Core.PathResolver):Kecubung.ParentMetaData {
    let path = pathResolver.resolve(filePath)
    let code = Fs.readFileSync(path).toString()
    return fromCode(code, filePath) 
}

export function fromCode(code:any, filePath: string = ""):Kecubung.ParentMetaData {
    let ast = Babylon.parse(code);
    return Kecubung.transform("ASTree", ast, filePath);
}

export function cleanUp(info: Core.RouteInfo[]) {
    return info.map(x => {
        let result: any = {
            initiator: x.initiator,
            route: x.route,
            httpMethod: x.httpMethod,
            methodMetaData: {
                name: x.methodMetaData ? x.methodMetaData.name : ""
            },
            //windows hack
            qualifiedClassName: x.qualifiedClassName!.replace(/\\/g, "/"),
            classMetaData: {
                name: x.classMetaData!.name
            },
            collaborator: x.collaborator,
        }
        if (x.analysis) result.analysis = x.analysis
        if (x.classMetaData!.baseClass) result.classMetaData.baseClass = x.classMetaData!.baseClass
        return result;
    });
}

export function errorReadFile(path: string): Buffer {
    throw new Error("Error: ENOENT: no such file or directory, open")
}

export function createFacade(rootPath: string) {
    let pathResolver = new Resolver.DefaultPathResolver(rootPath);
    let facade: Core.Facade = {
        identifierResolver: new Resolver.DefaultIdentifierResolver(),
        dependencyResolver: new Resolver.DefaultDependencyResolver(new Resolver.DefaultIdentifierResolver(), pathResolver),
        metaDataStorage: new Router.MetaDataLoader(new Resolver.DefaultIdentifierResolver(), pathResolver),
        pathResolver: pathResolver,
        autoValidation: true
    }
    return facade;
}

export function getRouteInfo(facade: Core.Facade, path: string, methodName: string) {
    let meta = fromFile(path, facade.pathResolver!)
    let infos = Router.transform(meta)
    let info = infos.filter(x => x.methodMetaData!.name == methodName)[0]
    info.classId = info.qualifiedClassName
    return info
}

