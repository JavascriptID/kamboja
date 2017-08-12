import { Facade } from "./facade";
import { LogType } from "./log-type";
import { Engine } from "./engine";

export interface KambojaOption extends Facade {
    skipAnalysis?: boolean
    controllerPaths?: string[]
    modelPath?: string
    rootPath: string
    showLog?: LogType
    socketEngine?: Engine

    //socket callback instance based on socket engine implementation
    socketApp?: any

    //http callback instance based on http engine implementation
    httpApp?: any
}