import { AuthUser } from "../security";

export interface Handshake {
    contextType: "Handshake"
    headers: any
    id: string
    rooms: string[]
    user: AuthUser
    params: { [key: string]: string }
    getHeader(key: string): string | undefined
    getParam(key: string): string | undefined
}