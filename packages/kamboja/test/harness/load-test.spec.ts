import { Middleware, Core, KambojaApplication, json } from "../../src"
import * as Path from "path"
import * as Supertest from "supertest"

class UselessMiddleware extends Middleware {
    execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return next.proceed();
    }
}

class ReturnJsonMiddleware extends Middleware {
    async execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return json({})
    }

}
/*
describe.only("Load test", () => {
    it("Should perform efficient middleware process", async () => {
        let kamboja = new KambojaApplication({ rootPath: __dirname, showLog: "None" })
            .set("views", Path.join(__dirname, "view"))
            .set("view engine", "hbs")

        
        for (let i = 0; i < 1000; i++) {
            kamboja.use(new UselessMiddleware())
        }
        
        //kamboja.use(new ReturnJsonMiddleware())

        let app = kamboja.init()

        console.time("start")
        for (let i = 0; i < 100; i++) {
            await Supertest(app)
                .get("/user/index")
                .expect(200)
        }
        console.timeEnd("start")
    }).timeout(190000)
})
*/