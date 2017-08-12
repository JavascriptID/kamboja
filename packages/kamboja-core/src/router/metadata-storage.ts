import { MetaDataLoaderCategory } from "./definition";
import { PathResolver } from "../resolver";
import { QualifiedClassMetaData } from "./qualified-class-metadata";
import * as Kecubung from "kecubung";

export interface MetaDataStorage {
    pathResolver: PathResolver
    get(classId: string): QualifiedClassMetaData | undefined
    getFiles(category: MetaDataLoaderCategory): Kecubung.ParentMetaData[]
    getClasses(category: MetaDataLoaderCategory): QualifiedClassMetaData[]
}