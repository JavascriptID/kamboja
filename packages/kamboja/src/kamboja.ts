import * as Core from "kamboja-core"
import * as Lodash from "lodash"
import { MetaDataLoader } from "./metadata-loader/metadata-loader"
import { DefaultDependencyResolver, DefaultIdentifierResolver, DefaultPathResolver } from "./resolver"
import { RouteGenerator, RouteAnalyzer } from "./route-generator"
import * as Fs from "fs"
import * as Path from "path"
import * as Chalk from "chalk"
import { Logger } from "./logger"
import * as Babylon from "babylon"
import * as Kecubung from "kecubung"
import { Validator, Middleware } from "./index"
import * as Http from "http"

/**
 * Create instance of KambojaJS application
 */
export class Kamboja implements Core.Application {
    private static defaultModelPath: string = "model"
    private static facade: Core.Facade;
    private options: Core.KambojaOption
    private log: Logger;
    private storage: MetaDataLoader;

    static getFacade() {
        return Kamboja.facade;
    }

    /**
     * Create instance of KambojaJS application
     * @param engine KambojaJS engine implementation
     * @param opt KambojaJS option
     */
    constructor(private engine: Core.Engine, opt: Core.KambojaOption | string) {
        let override: Core.KambojaOption;
        if (typeof opt === "string") override = { rootPath: opt }
        else override = opt
        let idResolver = new DefaultIdentifierResolver()
        let pathResolver = new DefaultPathResolver(override.rootPath)
        let resolver = new DefaultDependencyResolver(idResolver, pathResolver)
        let storage = new MetaDataLoader(idResolver, pathResolver)
        let options = Lodash.assign(<Core.KambojaOption>{
            skipAnalysis: false,
            controllerPaths: ["controller"],
            modelPath: Kamboja.defaultModelPath,
            autoValidation: true,
            rootPath: process.cwd(),
            showLog: "Info",
            validators: [],
            middlewares: [],
            facilities: [],
            identifierResolver: idResolver,
            pathResolver: pathResolver,
            dependencyResolver: resolver,
            metaDataStorage: storage
        }, override)
        this.options = options
        Kamboja.facade = options;
        this.log = new Logger(this.options.showLog!)
        this.storage = <MetaDataLoader>this.options.metaDataStorage
    }

    set(key: keyof Core.KambojaOption, value: any) {
        this.options[key] = value;
        return this;
    }

    get<T>(key: keyof Core.KambojaOption) {
        return <T>this.options[key];
    }

    /**
     * Add middleware
     * @param factory factory method that will be call after KambojaJS application initialized
     * @returns KambojaJS application
     */
    use(middleware: Core.MiddlewaresType) {
        if (Array.isArray(middleware))
            this.options.middlewares = this.options.middlewares!.concat(middleware)
        else this.options.middlewares!.push(middleware)
        return this
    }

    apply(facility: string | Core.Facility) {
        if (typeof facility == "string") {
            try {
                let fac = this.options.dependencyResolver!.resolve<Core.Facility>(facility)
                this.options.facilities!.push(fac)
                fac.apply(this)
            }
            catch (e) {
                throw new Error(`Unable to instantiate ${facility} as Facility`)
            }
        }
        else {
            this.options.facilities!.push(facility)
            facility.apply(this)
        }
        return this
    }

    private isFolderProvided() {
        let result = true;

        //controller
        this.options.controllerPaths!.forEach(x => {
            let path = this.options.pathResolver!.resolve(x);
            if (!Fs.existsSync(path)) {
                result = false;
                this.log.error(`Controller path [${x}] provided in configuration is not exist`)
            }
        })
        //model
        let modelPath = this.options.pathResolver!.resolve(this.options.modelPath!)
        if (!Fs.existsSync(modelPath) && this.options.modelPath != Kamboja.defaultModelPath) {
            this.log.error(`Model path [${this.options.modelPath}] provided in configuration is not exist`)
            result = false;
        }
        return result;
    }

    private generateRoutes(controllerMeta: Kecubung.ParentMetaData[]) {
        let route = new RouteGenerator(this.options.identifierResolver!, controllerMeta)
        let infos = route.getRoutes()
        if (infos.length == 0) {
            let paths = this.options.controllerPaths!.join(",")
            this.log.error(`No controller found in [${paths}]`)
        }
        return infos;
    }

    private analyzeRoutes(infos: Core.RouteInfo[]) {
        let routeAnalyzer = new RouteAnalyzer(infos)
        let analysis = routeAnalyzer.analyse();
        for (let item of analysis) {
            if (item.type == "Warning")
                this.log.warning(item.message)
            else
                this.log.error(item.message)
        }
        if (analysis.some(x => x.type == "Error")) {
            return false;
        }
        let validRoutes = infos.filter(x => !x.analysis || x.analysis.length == 0)
        if (validRoutes.length == 0) {
            let path = this.options.controllerPaths!.join(", ")
            this.log.newLine().error(`No valid controller found in [${path}]`)
            return false;
        }
        this.log.newLine().info("Routes generated successfully")
        this.log.info("--------------------------------------")
        validRoutes.forEach(x => {
            let method = ""
            switch (x.httpMethod) {
                case "GET": method = "GET    "; break;
                case "PUT": method = "PUT    "; break;
                case "PATCH": method = "PATCH  "; break;
                case "POST": method = "POST   "; break;
                case "DELETE": method = "DELETE "; break;
            }
            this.log.info(`${method} ${x.route}`)
        })
        this.log.info("--------------------------------------")
        this.options.routeInfos = validRoutes;
        return true;
    }

    private resolveMiddlewares(option:Core.KambojaOption){
        option.middlewares = Middleware.resolve(option.middlewares!, option.dependencyResolver!)
    }

    private resolveValidators(option:Core.KambojaOption){
        option.validators = Validator.resolve(option.validators!, option.dependencyResolver!)
    }
    
    /**
     * Initialize KambojaJS application 
     * @returns Http Callback handler returned by KambojaJS Engine implementation
     */
    init() {
        if (!this.isFolderProvided()) throw new Error("Fatal error")
        this.storage.load(this.options.controllerPaths!, "Controller")
        this.storage.load(this.options.modelPath!, "Model")
        this.resolveMiddlewares(this.options)
        this.resolveValidators(this.options)
        let routeInfos = this.generateRoutes(this.storage.getFiles("Controller"))
        if (routeInfos.length == 0) throw new Error("Fatal error")
        if (!this.analyzeRoutes(routeInfos)) throw new Error("Fatal Error")
        let httpControllers = routeInfos.filter(x => x.classMetaData!.baseClass == "ApiController" ||
            x.classMetaData!.baseClass == "Controller")
        let httpApp = this.engine.init(httpControllers, this.options)
        this.set("httpApp", httpApp)
        let server = Http.createServer(httpApp)
        if(this.options.socketEngine){
            let socketControllers = routeInfos.filter(x => x.classMetaData!.baseClass == "SocketController")
            let socketApp = this.options.socketEngine.init(socketControllers, this.options);
            this.set("socketApp", socketApp)
            socketApp.listen(server)
        }
        return server;
    }
}