export namespace RouteAnalysisCode {
    
        /**
         * Issue when route parameters doesn't have association
         * with action parameters
         */
        export const UnAssociatedParameters = 1;
    
        /**
         * Only applied on GET method, issue when action contains parameter
         * but route doesn't have any
         */
        export const MissingRouteParameters = 2;
    
        /**
         * Issue when router contains parameter, but action doesn't have any
         */
        export const MissingActionParameters = 3;
    
        /**
         * Issue when @internal decorator combined with other http method decorator
         */
        export const ConflictDecorators = 4;
    
        /**
         * API Convention fail because appropriate method name is match with
         * method naming convention but the method doesn't have parameters
         */
        export const ConventionFail = 5;
    
        export const ClassNotInheritedFromController = 6
    
        export const ClassNotExported = 7
    
        export const DuplicateRoutes = 8
    
        export const DuplicateParameterName = 9
        export const QueryParameterNotAllowed = 10
        export const DecoratorNotAllowed = 11
    }
    