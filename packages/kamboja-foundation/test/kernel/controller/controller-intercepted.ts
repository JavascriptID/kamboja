import {
    Core, Controller,
    middleware,
    Middleware
} from "../../../src"


@middleware.id("ChangeValueToHelloWorld")
export class ChangeValueToHelloWorld implements Middleware {
    async execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return new Core.ActionResult("Hello world!")
    }
}

@middleware.use("DefaultInterceptor, interceptor/default-interceptor")
@middleware.use(new ChangeValueToHelloWorld())
export class DummyApi extends Controller {

    @middleware.use("DefaultInterceptor, interceptor/default-interceptor")
    @middleware.use(new ChangeValueToHelloWorld())
    returnView() {
        return new Core.ActionResult("Helow")
    }
}