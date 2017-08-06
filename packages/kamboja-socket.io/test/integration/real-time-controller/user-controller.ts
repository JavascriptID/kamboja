import { Controller, route, broadcast, emit } from "kamboja-express";

export class UserController extends Controller {
  @route.on("connection")
  onConnect() {
    return broadcast("join", this.context.user);
  }

  @route.on("disconnect")
  onDisconnect() {
    return broadcast("leave", this.context.user);
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
