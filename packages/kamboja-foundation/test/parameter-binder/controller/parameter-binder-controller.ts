import { Controller, ApiController, type, bind } from "../../../src"
import { Cookie } from "kamboja-core"

export class DummyApi extends ApiController {
    myMethod(par1: any, par2: any) {
    }
    noParam() { }

    list(offset: any, pageWidth: any) { }
    modify(id: any, body: any) { }
    add(body: any) { }

    //value converter
    defaultConversion(par: any) { }

    decoratedConversion( @type("string") str: string, @type("number") num: number, @type("boolean") bool: boolean) { }
    conventionConversion(sName: string, iAge: number, bIsDirty: boolean, sname: string, iage: number, bisdirty: boolean) { }
    arrayDecorated( @type("string[]") str: string[], @type("number[]") num: number[], @type("boolean[]") bool: boolean[]) { }
    priority( @type("number") strName: number) { }

    decoratorBinder( @bind.body() body: any, @bind.cookie() cookies: Cookie[], @bind.cookie("age") age: number) { }

    typeBinder( @type("SimpleModel, model") model: any) { }
    typeBinderWithBind( @type("SimpleModel, model") model: any, @bind.body() body: any) { }
    typeBinderWithOtherType( @type("string") body: string, @type("SimpleModel, model") model: any) { }
}