export interface Cookie {
    key: string
    value: string
    options?: CookieOptions
}

export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date | boolean;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | "auto";
}