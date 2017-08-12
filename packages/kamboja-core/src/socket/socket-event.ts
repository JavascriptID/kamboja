export interface SocketEvent {
    type: "Broadcast" | "Private"// | "Room" | "JoinRoom"
    name: string
    id?: string | string[]
    payload?: any
}