import { Controller, ApiController } from "../../../src/controller"
import { val, bind } from "../../../src"
import {Cookie} from "kamboja-core"

export class DummyApi extends ApiController {
    myMethod(par1:any, par2:any) {
    }
    noParam() { }

    list(offset:any, pageWidth:any) { }
    modify(id:any, body:any) { }
    add(body:any) { }

    //value converter
    defaultConversion(par:any){

    }

    decoratedConversion(@val.type("string") str:string, @val.type("number") num:number, @val.type("boolean") bool:boolean){}
    conventionConversion(sName:string, iAge:number, bIsDirty:boolean, sname:string, iage:number, bisdirty:boolean){}
    arrayDecorated(@val.type("string[]") str:string[], @val.type("number[]") num:number[], @val.type("boolean[]") bool:boolean[]){}
    priority(@val.type("number") strName:number){}

    decoratorBinder(@bind.body() body:any, @bind.cookie() cookies:Cookie[], @bind.cookie("age") age:number){}
}