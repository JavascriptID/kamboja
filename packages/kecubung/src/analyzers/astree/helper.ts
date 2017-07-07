import { SyntaxKind, MetaData, AnalysisType, ValueMetaData, ValueMetaDataType, PrimitiveValueMetaData, ObjectValueMetaData, ArrayValueMetaData } from "../../core"

/**
 * require CallExpression.callee
 */
export function getMethodNameFromCallee(callee:any) {
    if (!callee) return "";
    if (callee.type == SyntaxKind.MemberExpression) return callee.property.name;
    else return callee.name;
}

/**
 * require CallExpression 
 */
export function isReservedDecorator(callExpression:any) {
    return getMethodNameFromCallee(callExpression.callee) == "__metadata"
        || getMethodNameFromCallee(callExpression.callee) == "__param"
        || getMethodNameFromCallee(callExpression.callee) == "__decorate"
}

export function getDecoratorParameterName(param:any):ValueMetaData {
    switch (param.type) {
        case SyntaxKind.StringLiteral:
            return getPrimitiveParameter("String", param)
        case SyntaxKind.NumericLiteral:
            return getPrimitiveParameter("Number", param)
        case SyntaxKind.BooleanLiteral:
            return getPrimitiveParameter("Boolean", param)
        case SyntaxKind.NullLiteral:
            return getPrimitiveParameter("Null", param)
        case SyntaxKind.ArrayExpression:
            return getArrayParameter(param)
        case SyntaxKind.ObjectExpression:
            return getObjectParameter(param)
        default:
            return <ValueMetaData>{
                type: "Unknown"
            };
    }
}

function getPrimitiveParameter(type: ValueMetaDataType, param:any) {
    return <PrimitiveValueMetaData>{
        type: type,
        value: param.value
    }
}


function getArrayParameter(param:any) {
    let result = <ArrayValueMetaData>{
        type: "Array",
        children: []
    }
    for (let item of param.elements) {
        result.children.push(getDecoratorParameterName(item))
    }
    return result;
}

function getPropertyParameter(param:any) {
    let value = getDecoratorParameterName(param.value);
    return <PrimitiveValueMetaData>{
        type: value.type,
        name: param.key.name,
        value: value
    }
}

function getObjectParameter(param:any) {
    let result = <ObjectValueMetaData>{
        type: "Object",
        properties: []
    }
    for (let item of param.properties) {
        result.properties.push(getPropertyParameter(item))
    }
    return result
}
