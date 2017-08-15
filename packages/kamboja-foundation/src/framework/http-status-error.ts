
export class HttpStatusError extends Error {
    constructor(public status:number, message?:string){
        super(message)
        Object.setPrototypeOf(this, HttpStatusError.prototype);
    }
}