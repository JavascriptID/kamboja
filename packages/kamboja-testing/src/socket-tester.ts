import * as Chai from "chai"
import * as SocketClient from "socket.io-client"

export function socketTester(host: string, option?: SocketIOClient.ConnectOpts) {
    return new Builder(host, option)
}

export class Builder {
    private client: SocketIOClient.Socket
    constructor(host: string, option?: SocketIOClient.ConnectOpts) {
        let opt = Object.assign({ autoConnect: false }, option)
        this.client = SocketClient(host, opt)
    }

    on(event: string) {
        this.client.connect()
        return new Tester(this.client, event)
    }

    wait(cb: (() => Promise<any>) | Promise<any>) {
        if(typeof cb == "function"){
            let promise = cb()
            return new Awaitable(promise, this.client)
        }
        else return new Awaitable(cb, this.client)
    }
}

export class Awaitable {
    constructor(private wait: Promise<any>, private client: SocketIOClient.Socket) { }

    async connect() {
        this.client.connect()
        await this.wait;
        this.client.close()
    }

    async emit(event: string, payload?: any) {
        try {
            this.client.connect();
            this.client.emit(event, payload);
            await this.wait
        }
        catch (e) {
            throw e
        }
        finally {
            this.client.close();
        }
    }
}

export class Tester {
    constructor(private client: SocketIOClient.Socket, private event: string) { }

    private start(callback?: (msg: any) => void, timeout = 300) {
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
        try {
            let result = await this.start(x => Chai.expect(x).deep.eq(msg))
            Chai.expect(result, `Expected '${this.event}' emitted, but timeout`).eq(true)
        }
        catch (e) {
            throw e
        }
        finally {
            this.client.close()
        }
    }

    async timeout(timeout?: number) {
        try {
            let result = await this.start(undefined, timeout)
            Chai.expect(result, `Expected timeout but '${this.event}' emitted`).eq(false)
        }
        catch (e) {
            throw e
        }
        finally {
            this.client.close()
        }
    }
}