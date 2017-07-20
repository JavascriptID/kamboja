import * as Chai from "chai"
import * as SocketClient from "socket.io-client"

export function socketTester(host: string, option?: SocketIOClient.ConnectOpts) {
    return new Builder(host, option)
}

export class Builder {
    private client: SocketIOClient.Socket
    constructor(host: string, option?: SocketIOClient.ConnectOpts) { this.client = SocketClient(host, option) }
    on(event: string) {
        return new Tester(this.client, event)
    }

    emit(event: string, payload: any) {
        this.client.emit(event, payload)
        return this.client
    }
}

export class Tester {
    constructor(private client: SocketIOClient.Socket, private event: string) { }

    private start(callback?: (msg: any) => void, timeout = 100) {
        return new Promise<boolean>((resolve, reject) => {
            let timer = setTimeout(function () {
                resolve(false)
            }, timeout);

            this.client.on(this.event, (msg: string) => {
                try {
                    if (callback) callback(msg)
                    clearTimeout(timer)
                    resolve(true)
                }
                catch (e) {
                    reject(e)
                }
            })
        })
    }

    async expect(msg: any) {
        let result = await this.start(x => Chai.expect(x).eq(msg))
        Chai.expect(result, `Expected '${this.event}' emitted, but timeout`).eq(true)
        this.client.close()
    }

    async timeout(timeout?:number) {
        let result = await this.start(undefined, timeout)
        Chai.expect(result, `Expected timeout but '${this.event}' emitted`).eq(false)
        this.client.close()
    }
}