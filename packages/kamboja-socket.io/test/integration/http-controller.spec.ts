import * as Chai from "chai"
import * as Supertest from "supertest"
import { KambojaApplication, Core } from "kamboja-express"
import { RealTimeFacility } from "../../src/"
import * as BodyParser from "body-parser"
import * as SocketClient from "socket.io-client"
import * as Http from "http"

function listen(client: SocketIOClient.Socket, event: string, callback: (msg: any) => void) {
    return new Promise<boolean>((resolve, reject) => {
        setTimeout(function() {
            resolve(false)
        }, 500);

        client.on("http/updated", (msg: string) => {
            try {
                callback(msg)
                resolve(true)
            }
            catch (e) {
                reject(e)
            }
        })
    })
}

class TokenAuthMiddleware implements Core.Middleware {
    execute(context: Core.Handshake | Core.HttpRequest, next: Core.Invocation): Promise<Core.ActionResult> {
        let token = context.getHeader("token") || context.getParam("token")
        if (token) context.user = { id: token }
        return next.proceed()
    }
}


describe.only("HttpController with real time functionalities", () => {
    let app: Http.Server
    let firstClient: SocketIOClient.Socket;
    let secondClient: SocketIOClient.Socket;
    const HOST = "http://localhost:5000"


    afterEach(done => {
        secondClient.close()
        firstClient.close()
        app.close(done)
        console.log("DOne")
    })

    it("Should able to broadcast event using http controller", async () => {
        app = new KambojaApplication(__dirname)
            .set("showLog", "None")
            .use(BodyParser.json())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        firstClient = SocketClient(HOST);
        secondClient = SocketClient(HOST)

        let [, first, second] = await Promise.all([
            Supertest(HOST)
                .post("/http")
                .send({ data: "hello" })
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.body).eq("Success!")
                })
                .expect(200),
            listen(firstClient, "http/updated", msg => Chai.expect(msg).eq("Hello")),
            listen(secondClient, "http/updated", msg => Chai.expect(msg).eq("Hello"))
        ])
        Chai.expect(first).true;
        Chai.expect(second).true;
    })

    it.only("Should able to send event to specific user", async () => {
        app = new KambojaApplication(__dirname)
            .use(BodyParser.json())
            .use(new TokenAuthMiddleware())
            .apply(new RealTimeFacility())
            .init();

        await new Promise(resolve => app.listen(5000, resolve))

        //create socket client and set identity to client 1
        firstClient = SocketClient(HOST, { query: { token: "1" } }); 
        //create socket client and set identity to client 2
        secondClient = SocketClient(HOST, { query: { token: "2" } }) 

        let [, first, second] = await Promise.all([
            //client 1 do a request to /http/send 
            Supertest(HOST)
                //send notification to client 2 (see controller/http-controller)
                .post("/http/send?to=2") 
                //set identity to client 1
                .set("token", "1") 
                .send({ data: "hello" })
                .expect((response: Supertest.Response) => {
                    Chai.expect(response.body).eq("Success!")
                })
                .expect(200),
            //expect notification received by client 1 (should not received, timeout and return false)
            listen(firstClient, "http/updated", msg => Chai.expect(msg).eq("Hello this message from 1")),
            //expect notification received by client 2 (should received and return true)
            listen(secondClient, "http/updated", msg => Chai.expect(msg).eq("Hello this message from 1"))
        ])
        //client 1 should not receive notification
        Chai.expect(first).false;
        //client 2 should receive notification
        Chai.expect(second).true;
    })
})