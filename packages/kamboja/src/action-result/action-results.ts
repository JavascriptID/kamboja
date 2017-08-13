import { JsonActionResult } from "./json-action-result"
import { ViewActionResult } from "./view-action-result"
import { RedirectActionResult } from "./redirect-action-result"
import { FileActionResult } from "./file-action-result"
import { DownloadActionResult } from "./download-action-result"
import { Core } from "kamboja-foundation"

export function download(path: string) {
    return new DownloadActionResult(path)
}
export function file(path: string) {
    return new FileActionResult(path)
}
export function json(body: any, status?: number) {
    return new JsonActionResult(body, status)
}
export function redirect(path: string) {
    return new RedirectActionResult(path)
}
export function view(model?: any, viewName?: string) {
    return new ViewActionResult(model, viewName)
}
export function broadcast(event: string, data: any) {
    return new Core.ActionResult(data, 200, "application/json").broadcast(event)
}
export function emit(event: string, id: string | string[], data: any) {
    return new Core.ActionResult(data, 200, "application/json").emit(event, id)
}