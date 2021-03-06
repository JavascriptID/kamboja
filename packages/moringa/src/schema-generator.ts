import { TypeConverter } from "./type-converter"
import { TypeChecker } from "./type-checker"
import * as Kecubung from "kecubung"
import * as Shortid from "shortid"
import * as Core from "kamboja-core"

export class SchemaGenerator {
    constructor(private pathResolver: Core.PathResolver, private converter: TypeConverter) { }

    generate(clazz: Core.QualifiedClassMetaData) {
        let schema: any = {}
        if (!clazz.properties) return
        //shortid
        if (clazz.decorators && clazz.decorators.some(x => x.name == "shortid")) {
            schema._id = {
                type: String,
                default: Shortid.generate
            }
        }
        clazz.properties.forEach(x => {
            let type = this.getType(x, clazz.name)
            schema[x.name] = this.converter.convert(type, clazz.name)
        })
        return schema;
    }

    private getType(property: Kecubung.PropertyMetaData, typeName: string) {
        let decorators = property.decorators!.filter(x => x.name == "type");
        if (decorators.length > 1) throw new Error(`Multiple @type found in [${typeName}]`)
        if (decorators.length == 0) throw new Error(`No type information found in [${typeName}.${property.name}], please decorate property with @type`)
        let decorator = decorators[0]
        let parameter = <Kecubung.PrimitiveValueMetaData>decorator.parameters[0]
        let type: string = parameter.value;
        return type
    }
}