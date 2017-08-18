import { Core, Kamboja } from "kamboja-foundation"
import * as Mongoose from "mongoose"
import { SchemaGenerator } from "./schema-generator"
import * as H from "./helper"
import * as Kecubung from "kecubung"
import { OptionBuilder } from "./option-builder"
import { TypeConverter } from "./type-converter"

export class MongooseHelper {
    private static instance: MongooseHelper
    schemas: { [key: string]: Mongoose.Schema } = {}

    static getInstance() {
        if (!MongooseHelper.instance) {
            let facade = Kamboja.getFacade();
            if (!facade) throw new Error("Instance of Kamboja not found, do setup after Kamboja instantiation")
            MongooseHelper.instance = new MongooseHelper(facade.pathResolver!,
                facade.metaDataStorage!.getClasses("Model"))
        }
        return MongooseHelper.instance
    }

    constructor(private pathResolver: Core.PathResolver, classes: Core.QualifiedClassMetaData[]) {
        this.init(classes)
    }

    createModel<T>(name: string) {
        return Mongoose.model<T & Mongoose.Document>(name)
    }

    private init(classes: Core.QualifiedClassMetaData[]) {
        let converter = new TypeConverter(this.pathResolver, classes)
        let generator = new SchemaGenerator(this.pathResolver, converter)
        let optionBuilder = new OptionBuilder()
        classes.forEach(x => {
            let schema = generator.generate(x)
            let option = optionBuilder.getOption(x)
            let name = H.getName(x.name);
            this.schemas[name] = new Mongoose.Schema(schema, option)
            if (!Mongoose.modelNames().some(x => x == name))
                Mongoose.model(name, this.schemas[name])
        })
    }
}

export function model<T>(name: string) {
    return MongooseHelper.getInstance()
        .createModel<T>(name)
}