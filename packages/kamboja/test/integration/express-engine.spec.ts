import * as Supertest from "supertest"
import * as Chai from "chai"
import { json, KambojaApplication, application, ApiFacility, Invocation } from "../../src"
import * as Express from "express"
import * as Kamboja from "kamboja-foundation"
import * as Lodash from "lodash"
import * as Fs from "fs"
import * as Morgan from "morgan"
import * as CookieParser from "cookie-parser"
import * as BodyParser from "body-parser"
import * as Logger from "morgan"
import { ErrorHandler } from "./interceptor/error-handler"
import * as Path from "path"
import { ConcatMiddleware } from "./interceptor/concat-middleware"
import { LoginUser } from "../../src/login-user"
import { Server, IncomingMessage } from "http"
import { DependencyResolver, Facility } from "kamboja-core"
import * as Del from "del"
import * as Compression from "compression"

class ErrorDependencyInjection implements DependencyResolver {
    count = 0;
    resolver: DependencyResolver
    constructor() {
        let idResolver = new Kamboja.Resolver.DefaultIdentifierResolver()
        let pathResolver = new Kamboja.Resolver.DefaultPathResolver(__dirname)
        this.resolver = new Kamboja.Resolver.DefaultDependencyResolver(idResolver, pathResolver)
    }
    resolve<T>(qualifiedClassName: string): T {
        if(this.count++ > 13) throw new Error("Dependency resolver error")
        return this.resolver.resolve(qualifiedClassName)
    }
}

describe("Integration", () => {
    describe("General", () => {
        it("Should be able to add facility", () => {
            let app = application(__dirname)
                .apply("BasicFacility, facility/basic-facility")
            Chai.expect(app.get("showLog")).eq("None")
            Chai.expect(app.get("skipAnalysis")).true;
            Chai.expect(app.get<Facility[]>("facilities").length).eq(1)
        })

        it("Should be able to set kamboja option", () => {
            let app = application(__dirname)
                .set("showLog", "None")
                .set("skipAnalysis", true)

            Chai.expect(app.get("showLog")).eq("None")
            Chai.expect(app.get("skipAnalysis")).true;
        })

        it("Should be able to set express option", () => {
            let app = application(__dirname)
                .set("case sensitive routing", undefined)
                .set("env", "development")
                .set("etag", "weak")
                .set("json replacer", undefined)
                .set("json spaces", undefined)
                .set("query parser", "extended")
                .set("trust proxy", false)
                .set("views", undefined)
                .set("view cache", undefined)
                .set("view engine", undefined)
                .set("x-powered-by", undefined)
        })

        it("Should able to use external server", async () => {
            //let uws = http.getExpressApp(Express)
            let app = <any>new KambojaApplication({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init(Express())

            await Supertest(app)
                .get("/user/index")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).contain("user/index")
                })
                .expect(200)
        })
    })

    describe("Controller", () => {
        let app: Server
        beforeEach(() => {
            app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()
        })

        it("Should provide Express Request properly in controller", () => {
            return Supertest(app)
                .get("/home/requestinstance")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ success: true })
                })
                .expect(200)
        })

        it("Should init express properly", () => {
            return Supertest(app)
                .get("/user/index")
                .expect((result: Supertest.Response) => {
                    console.log(result)
                    Chai.expect(result.text).contain("user/index")
                })
                .expect(200)
        })

        it("Should able to write header from controller", () => {
            return Supertest(app)
                .get("/user/setheader")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.header["accept"]).eq("text/xml")
                })
                .expect(200)
        })

        it("Should able to receive request with query string", () => {
            return Supertest(app)
                .get("/user/with/123?iAge=20&bGraduated=true")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.type).eq("application/json")
                    Chai.expect(result.body).deep.eq({ id: 123, age: 20, graduated: true })
                })
                .expect(200)
        })

        it("Should provide 404 if unhandled url requested", () => {
            return Supertest(app)
                .get("/unhandled/url")
                .expect(404)
        })

        it("Should return json properly", () => {
            return Supertest(app)
                .get("/home/json")
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.body).deep.eq({ message: "Hello world" })
                })
                .expect(200)
        })

        it("Should able to intercept unhandled url from interception", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .use("GlobalInterceptor, interceptor/global-interceptor")
                .init()
            return Supertest(app)
                .get("/unhandled/url")
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.text).eq("HELLOW!!")
                })
                .expect(200)
        })
    })

    describe("ApiController", () => {
        it("Should handle error properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()

            return Supertest(app)
                .get("/apiwitherror/1")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ message: "This is custom error" })
                })
                .expect(500)
        })

        it("Should handle error on resolving controller properly", () => {
            /*
            THIS TEST DEPENDS ON NUMBER OF ROUTE GENERATED
            INCREASE NUMBER OF COUNT ON ErrorDependencyInjection (ABOVE)
            SELF NOTE:
                FIND OUT WAY TO FIX THIS
            */
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .set("dependencyResolver", new ErrorDependencyInjection())
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .get("/categories/1")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body.message).contains("Can not instantiate [CategoriesController, api/api-controller] as Controller")
                })
                .expect(500)
        })

        it("Should handle `get` properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .get("/categories/1")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).eq(1)
                })
                .expect(200)
        })

        it("Should handle `add` properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .post("/categories")
                .send({ data: "Hello!" })
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ data: "Hello!" })
                })
                .expect(200)
        })

        it("Should handle `list` with default value properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .get("/categories")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ offset: 1, limit: 10, query: '' })
                })
                .expect(200)
        })

        it("Should handle `list` with custom value properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .get("/categories?iOffset=30&query=halo")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ offset: 30, limit: 10, query: 'halo' })
                })
                .expect(200)
        })

        it("Should handle `replace` properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .put("/categories/20")
                .send({ data: "Hello!" })
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ data: "Hello!" })
                })
                .expect(200)
        })

        it("Should handle `modify` properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .patch("/categories/20")
                .send({ data: "Hello!" })
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ data: "Hello!" })
                })
                .expect(200)
        })

        it("Should handle `delete` properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .apply(new ApiFacility())
                .init()
            return Supertest(app)
                .delete("/categories/20")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).eq(20)
                })
                .expect(200)
        })
    })

    describe("ApiController With @http.root() logic", () => {
        let app: Server;
        beforeEach(() => {
            app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .useExpress(BodyParser.json())
                .init()
        })
        it("Should handle `get` properly", () => {
            return Supertest(app)
                .get("/categories/1/items/1")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ id: 1, categoryId: 1 })
                })
                .expect(200)
        })

        it("Should handle `add` properly", () => {
            return Supertest(app)
                .post("/categories/1/items")
                .send({ data: "Hello!" })
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ data: "Hello!", categoryId: 1 })
                })
                .expect(200)
        })

        it("Should handle `list` with default value properly", () => {
            return Supertest(app)
                .get("/categories/1/items")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ offset: 1, limit: 10, query: '', categoryId: 1 })
                })
                .expect(200)
        })

        it("Should handle `list` with custom value properly", () => {
            return Supertest(app)
                .get("/categories/1/items?iOffset=30&query=halo")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ offset: 30, limit: 10, query: 'halo', categoryId: 1 })
                })
                .expect(200)
        })

        it("Should handle `replace` properly", () => {
            return Supertest(app)
                .put("/categories/1/items/20")
                .send({ data: "Hello!" })
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ data: "Hello!", categoryId: 1 })
                })
                .expect(200)
        })

        it("Should handle `modify` properly", () => {
            return Supertest(app)
                .patch("/categories/1/items/20")
                .send({ data: "Hello!" })
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ data: "Hello!", categoryId: 1 })
                })
                .expect(200)
        })

        it("Should handle `delete` properly", () => {
            return Supertest(app)
                .delete("/categories/1/items/20")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ id: 20, categoryId: 1 })
                })
                .expect(200)
        })
    })

    describe("Express Minddleware", () => {
        it("Should able to chain invocation if using express middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewarechain")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.header["custom-header"]).eq("hello")
                    Chai.expect(result.text).eq("Hello")
                })
        })

        it("Should return 404 if execute middleware inside action which call next", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewareinsideaction")
                .expect(404)
        })

        it("Should be able to send error from express middleware to chain invocation", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewaresenderror")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).eq("USER ERROR")
                })
                .expect(500)

        })

        it("Should be able to use asynchronous express middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewareasync")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.header["custom-header"]).eq("hello")
                    Chai.expect(result.text).eq("Hello")
                })
                .expect(200)

        })

        it("Should be able to use asynchronous express middleware which doesn't call next function", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewareasyncbypassaction")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.header["custom-header"]).eq("hello")
                    Chai.expect(result.text).eq("Not Hello")
                })
                .expect(200)

        })

        it("Should able to catch error inside action if using express middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewarewitherroraction")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.header["custom-header"]).eq("hello")
                    Chai.expect(result.text).eq("Internal Error")
                })
                .expect(500)
        })

        it("Should able to modify req.user from inside express middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/expressmiddlewaremodifyuser")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.body).deep.eq({ name: "Nobita" })
                })
                .expect(200)
        })

        it("Should be able to upload file using multer", async () => {
            let app = application(__dirname)
                .set("showLog", "None")
                .init()
            await Supertest(app)
                .post("/home/upload")
                .attach("thefile", Path.join(__dirname, "./file/dummy.txt"))
                .expect((res: Supertest.Response) => {
                    Chai.expect(res.text).eq("dummy.txt")
                })
                .expect(200)
            Del(Path.join(__dirname, "./upload"))
        })

        it("Should able to use cookie properly", async () => {
            let app = application(__dirname)
                .set("showLog", "None")
                .useExpress(CookieParser())
                .init()

            await Supertest(app)
                .get("/home/returncookie")
                .set("Cookie", "auth-example=SUPER_SECRET")
                .expect((res: Supertest.Response) => {
                    Chai.expect(res.text).eq("SUPER_SECRET")
                })
                .expect(200)
        })

        it("Should able to use compression middleware properly", async () => {
            let app = application(__dirname)
                .set("showLog", "None")
                .useExpress(Compression({ threshold: "0kb" }))
                .init()

            await Supertest(app)
                .get("/home/compression")
                .expect((res: Supertest.Response) => {
                    Chai.expect(res.header["content-encoding"]).eq("gzip")
                    Chai.expect(res.text).eq("Lorem ipsum")
                })
                .expect(200)
        })
    })

    describe("Middleware Function", () => {

        it("Should provide Express request in middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .use((req: Express.Request, inv: Invocation) => {
                    if (req instanceof IncomingMessage)
                        return inv.proceed()
                    else
                        throw Error("Not instance of IncomingMessage")
                })
                .init()
            return Supertest(app)
                .get("/user/index")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).contain("user/index")
                })
                .expect(200)
        })

        it("Should be able to add callback middleware in global scope", async () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .use(async (context: Express.Request, next: Invocation) => {
                    return json({}, 501)
                })
                .init()

            return Supertest(app)
                .get("/user/index")
                .expect(501)
        })

        it("Should be able to add callback middleware in method scope", async () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .init()

            return Supertest(app)
                .get("/user/kambojacallbackmiddleawre")
                .expect(501)
        })

        it("Should throw error if provided invalid middleware name", async () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .use("InvalidName, path/of/nowhere")

            try {
                app.init()
            }
            catch (e) {
                Chai.expect(e.message).eq("Can not instantiate middleware [InvalidName, path/of/nowhere]")
            }
        })

        it("Should be able to add middleware in global scope", async () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .useExpress((req, res, next) => {
                    res.status(501)
                    res.end()
                })
                .init()

            //class decorated with middleware to force them return 501
            //all actions below the class should return 501
            await new Promise((resolve, reject) => {
                Supertest(app)
                    .get("/user/index")
                    .expect(501, resolve)
            })

            await new Promise((resolve, reject) => {
                Supertest(app)
                    .get("/methodscopedmiddleware/otherindex")
                    .expect(501, resolve)
            })
        })

        it("Should be able to add middleware in class scope", async () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()
            //class decorated with middleware to force them return 501
            //all actions below the class should return 501
            await new Promise((resolve, reject) => {
                Supertest(app)
                    .get("/classscopedmiddleware/index")
                    .expect(501, resolve)
            })

            await new Promise((resolve, reject) => {
                Supertest(app)
                    .get("/classscopedmiddleware/otherindex")
                    .expect(501, resolve)
            })
        })

        it("Should be able to add middleware in method scope", async () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .useExpress((req, res, next) => {
                    res.status(501)
                    res.end()
                }).init()

            await new Promise((resolve, reject) => {
                //index decorated with middleware to force them return 501
                Supertest(app)
                    .get("/methodscopedmiddleware/index")
                    .expect(501, resolve)
            })

            await new Promise((resolve, reject) => {
                //otherindex should not affected by the the decorator
                Supertest(app)
                    .get("/methodscopedmiddleware/otherindex")
                    .expect((response: Supertest.Response) => {
                        Chai.expect(response.body).eq("Hello!")
                    })
                    .expect(200, resolve)
            })
        })

        it("Should able to use KambojaJS middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()

            return Supertest(app)
                .get("/user/withmiddleware")
                .expect(400)
        })

        it("Should invoke middleware in proper order", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .use(new ConcatMiddleware("global-01"))
                .use(new ConcatMiddleware("global-02"))
                .init()

            return Supertest(app)
                .get("/concat/index")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).eq("action-01 action-02 controller-01 controller-02 global-01 global-02 result")
                })
                .expect(200)
        })
    })

    describe("Error Handler", () => {
        it("Should handle error properly", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .init()
            return Supertest(app)
                .get("/home/index")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).contains(`Failed to lookup view "home/index"`)
                })
                .expect(500)
        })

        it("Should able to handle error from middleware", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .use(new ErrorHandler())
                .init()
            return Supertest(app)
                .get("/user/haserror")
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).contain("oops!")
                })
                .expect(200)
        })

        it("Should able to get controller info from error handler", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .use(new ErrorHandler((i) => {
                    Chai.expect(i.controllerInfo!.qualifiedClassName).eq("UserController, controller/usercontroller")
                }))
                .init()
            return Supertest(app)
                .get("/user/haserror")
                .expect(200)
        })

        it("Should able to catch error with multiple middlewares", () => {
            let app = application({ rootPath: __dirname, showLog: "None" })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .use(new ErrorHandler())
                .use("ResponseTimeMiddleware, interceptor/response-time-middleware")
                .init()
            return Supertest(app)
                .get("/user/haserror")
                .expect(200)
        })

        it("Should able to handle internal system error", () => {
            let app = application({ rootPath: __dirname, showLog: "None", controllerPaths: ["api"] })
                .set("views", Path.join(__dirname, "view"))
                .set("view engine", "hbs")
                .useExpress(BodyParser.json())
                .use(new ErrorHandler())
                .init()
            return Supertest(app)
                .post("/categories")
                .type("application/json")
                .send(`{ "message": "Hello`)
                .expect((result: Supertest.Response) => {
                    Chai.expect(result.text).contain("oops!")
                })
                .expect(200)
        })
    })

})
