import { Controller, route, broadcast, emit, type } from "kamboja-express";
import {DataModel} from "../model/data-model"

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

  @route.on("validate")
  withValidation(@type("DataModel, model/data-model") msg: DataModel) {
    return emit("custom-event", msg.to, { message: msg.message });
  }
}
