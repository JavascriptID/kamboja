import * as io from "socket.io"
import * as http from "http"

let app = http.createServer()
let ioclient = io();
ioclient.on("connection", socket => {
    socket.on("message", msg => {
        socket.emit("feedback", msg);
    })
    socket.on("broadcast", msg => {
        socket.broadcast.emit("feedback", msg)
    })
})
ioclient.listen(app)
export {app} 