import {RouteGenerator} from "kamboja"
import * as Test from "kamboja-testing"
import * as Sinon from "sinon"

export function delay(millisecond = 5){
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            resolve()
        }, millisecond)
    })
}

export function spy<T>(obj:T): T & Test.Mockable<T, Sinon.SinonSpy> {
    return Test.spy<T>(obj);
}

export function stub<T>(obj:T): T & Test.Mockable<T, Sinon.SinonStub> {
    return Test.stub<T>(obj)
}