import {DependencyResolver, IdentifierResolver, PathResolver} from "../resolver"
import { ValidatorCommand } from "../validator";
import { MetaDataStorage, RouteInfo } from "../router";
import { AuthUserStore } from "../security";
import { Middleware, MiddlewaresType } from "./middleware";
import { Facility } from "./facility";

export interface Facade {
    dependencyResolver?: DependencyResolver
    identifierResolver?: IdentifierResolver
    pathResolver?: PathResolver
    validators?: (ValidatorCommand | string)[]
    metaDataStorage?: MetaDataStorage
    middlewares?: MiddlewaresType[]
    autoValidation?: boolean
    authUserStore?: AuthUserStore
    routeInfos?: RouteInfo[]
    facilities?: Facility[]
}