import { HttpRequest } from "./http-request";
import { Response } from "../framework/response"

export class HttpError {
    constructor(public status: number,
        public error: any,
        public request: HttpRequest,
        public response: Response) { }
}