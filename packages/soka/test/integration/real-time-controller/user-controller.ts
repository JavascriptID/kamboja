import { Controller, route, broadcast, emit, type, json, view, redirect, file, download } from "kamboja";
import { DataModel } from "../model/data-model"

export class UserController extends Controller {
  @route.on("connection")
  onConnect() {
    return broadcast("join", this.handshake.user);
  }

  @route.on("disconnect")
  onDisconnect() {
    return broadcast("leave", this.handshake.user);
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
  withValidation( @type("DataModel, model/data-model") msg: DataModel) {
    return emit("custom-event", msg.to, { message: msg.message });
  }

  @route.on("get-data")
  returnPrimitive() {
    return { message: "Success!" }
  }

  @route.on("get-json")
  returnJson() {
    return json({ message: "Success!" })
  }

  @route.on("get-view")
  returnView() {
    return view({ message: "Success!" })
  }

  @route.on("get-file")
  returnFile() {
    return file("./file.txt")
  }

  @route.on("get-redirect")
  returnRedirect() {
    return redirect("/index")
  }

  @route.on("get-download")
  returnDownload() {
    return download("./file.txt")
  }
}
