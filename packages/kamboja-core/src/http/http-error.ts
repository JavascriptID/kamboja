import { HttpRequest } from "./http-request";

export class HttpError {
    constructor(public status: number,
        public error: any,
        public request: HttpRequest,
        public response: Response) { }
}