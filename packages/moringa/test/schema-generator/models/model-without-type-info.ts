import {val} from "kamboja-foundation"

export class UserModel{
    @val.required()
    email:string
}