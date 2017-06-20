import { JsonActionResult } from "./json-action-result"
import { ViewActionResult } from "./view-action-result"
import { RedirectActionResult } from "./redirect-action-result"
import { FileActionResult } from "./file-action-result"
import { DownloadActionResult } from "./download-action-result"

export class ActionResults {
    download(path: string) {
        return new DownloadActionResult(path)
    }
    file(path: string) {
        return new FileActionResult(path)
    }
    json(body:any, status?: number) {
        return new JsonActionResult(body, status)
    }
    redirect(path: string) {
        return new RedirectActionResult(path)
    }
    view(model?:any, viewName?: string) {
        return new ViewActionResult(model, viewName)
    }
}