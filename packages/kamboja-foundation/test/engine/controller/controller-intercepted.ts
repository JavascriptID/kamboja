import {
    Core, Controller,
    middleware,
    MiddlewareBase,
    ActionResultBase
} from "../../../src"


@middleware.id("ChangeValueToHelloWorld")
export class ChangeValueToHelloWorld implements MiddlewareBase {
    async execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        return new ActionResultBase("Hello world!")
    }
}

@middleware.use("DefaultInterceptor, interceptor/default-interceptor")
@middleware.use(new ChangeValueToHelloWorld())
export class DummyApi extends Controller {

    @middleware.use("DefaultInterceptor, interceptor/default-interceptor")
    @middleware.use(new ChangeValueToHelloWorld())
    returnView() {
        return new ActionResultBase("Helow")
    }
}