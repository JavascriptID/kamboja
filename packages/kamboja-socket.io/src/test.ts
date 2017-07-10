import * as io from "socket.io"


io().use((socket, next) => {
    socket.request
})