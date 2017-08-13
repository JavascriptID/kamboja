import * as Core from "kamboja-core"

export abstract class Facility implements Core.Facility{
    abstract apply(app: Core.Application): void;
}