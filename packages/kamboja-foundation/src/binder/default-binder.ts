import { RouteInfo, HttpRequest } from "kamboja-core";
import { BinderBase, BinderResult } from "./binder-base";
import { convert } from "./value-converter";

export class DefaultBinder extends BinderBase {
  bind(routeInfo: RouteInfo, parameterName: string, request: HttpRequest): BinderResult {
    return this.exit(convert(routeInfo, parameterName, request.getParam(parameterName)));
  }
}
