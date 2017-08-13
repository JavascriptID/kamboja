import {Controller, route} from "../../../src"

export class SimpleController extends Controller {

    @route.get("/this/get/got/different")
    getMethod() { }

    @route.post("/this/post/got/different")
    postMethod() { }

    @route.put("/this/put/got/different")
    putMethod() { }

    @route.delete("/this/delete/got/different")
    deleteMethod() { }

    @route.patch("/this/patch/got/different")
    patchMethod() { }

    @route.on("this/is/event")
    eventMethod() {}
}