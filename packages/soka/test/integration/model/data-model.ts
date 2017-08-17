import {val} from "kamboja"


export class DataModel {
    @val.required()
    to:string;
    @val.required()
    message:string;
}