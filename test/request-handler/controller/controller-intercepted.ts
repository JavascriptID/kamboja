import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/request-handler/interceptor-decorator"
import { val, decoratorName, Interceptor, Invocation, JsonActionResult } from "../../../src"
import { id } from "../interceptor/interceptor-identifier"

@id("ChangeValueToHelloWorld")
export class ChangeValueToHelloWorld implements Interceptor {
    async intercept(invocation: Invocation): Promise<void> {
        invocation.returnValue = new JsonActionResult("Hello world!", undefined, undefined)
    }
}

@interceptor("DefaultInterceptor, test/request-handler/interceptor/default-interceptor")
@interceptor(new ChangeValueToHelloWorld())
export class DummyApi extends Controller {

    @interceptor("DefaultInterceptor, test/request-handler/interceptor/default-interceptor")
    @interceptor(new ChangeValueToHelloWorld())
    returnView() {
        return this.json("Helow")
    }
}