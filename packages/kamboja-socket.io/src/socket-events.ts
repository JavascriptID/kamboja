import { SocketEvent, AuthUser } from "kamboja-core"

export class BroadcastEvent implements SocketEvent {
    type: "Broadcast" = "Broadcast"
    constructor(public name: string, public payload?: any) { }
}

export class PrivateEvent implements SocketEvent {
    type: "Private" = "Private"
    id: string | string[]
    constructor(public name: string, user: AuthUser | AuthUser[], public payload?: any) {
        if (Array.isArray(user))
            this.id = user.map(x => x.id)
        else
            this.id = user.id;
    }
}

export class RoomEvent implements SocketEvent {
    type: "Room" = "Room"
    constructor(public name: string, public id: string, public payload?: any) { }
}