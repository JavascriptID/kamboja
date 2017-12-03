import * as Sinon from "sinon"
import * as Util from "util"
import { reflect } from "./reflect"

export type Mock<T, TResult> = {
    [P in keyof T]: TResult
}

export interface Mockable<T, TResult> {
    MOCKS: Mock<T, TResult>
}

export type Spy<T> = T & Mockable<T, Sinon.SinonSpy>
export type Stub<T> = T & Mockable<T, Sinon.SinonStub>

function mock<T extends { [key: string]: any }, TResult>(obj: T, sinon: (obj: any, key: string) => TResult): (T & Mockable<T, TResult>) {
    let mocks = <any>{}
    for (let key of reflect(obj)) {
        if (typeof obj[key] == "function")
            mocks[key] = sinon(obj, key)
    }
    let result: any = obj
    result.MOCKS = mocks
    return result;
}


export function spy<T>(obj: T): Spy<T> {
    return mock(obj, Sinon.spy);
}

export function stub<T>(obj: T): Stub<T> {
    return mock(obj, Sinon.stub)
}