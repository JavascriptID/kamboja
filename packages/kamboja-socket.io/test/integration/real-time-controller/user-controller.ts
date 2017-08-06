import { Controller, route, broadcast, emit } from "kamboja-express";

export class UserController extends Controller {
  @route.on("connection")
  onConnect() {
    return broadcast("custom-event", { message: "Client connected" });
  }

  @route.on("disconnect")
  onDisconnect() {
    return broadcast("custom-event", { message: "Client disconnected" });
  }

  @route.on("send")
  sendPrivate(msg: { to: string; message: string }) {
    return emit("custom-event", msg.to, { message: msg.message });
  }

  @route.on("send-all")
  sendBroadcast(msg: string) {
    return broadcast("custom-event", { message: msg });
  }
}
