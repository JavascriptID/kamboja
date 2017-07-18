import * as Chai from "chai"
import * as Supertest from "supertest"
import { KambojaApplication } from "kamboja-express"
import { RealTimeFacility } from "../../src/"
import * as BodyParser from "body-parser"
import * as SocketClient from "socket.io-client"
import * as Http from "http"




describe("HttpController with real time functionalities", () => {
    let app: Http.Server

    beforeEach(done => {
        app = new KambojaApplication(__dirname)
            .apply(new RealTimeFacility())
            .use(BodyParser.json())
            .init();
        app.listen(5000, done)
    })

    afterEach(done => {
        app.close(done)
        console.log("Done")
    })

    it("Should able to emit event using http controller", () => {
        /*
        let client = SocketClient("http://localhost:5000");
        return Supertest(app)
        .post("/http")
        .send("Hello")
        .expect(200);*/
        //return Promise.all([
            //,
            /*new Promise((resolve, reject) => {
                client.on("http/updated", (msg: string) => {
                    try {
                        Chai.expect(msg).eq("Hello")
                        resolve()
                    }
                    catch (e) {
                        reject(e)
                    }
                })
            })*/
        //])
    })
})