import { Binder, Router } from "../../src"
import * as Chai from "chai"
import * as H from "../helper"
import {DefaultPathResolver} from "../../src/resolver"


describe("Value Converter", () => {
    describe("Default Value Converter", () => {
        it("Should convert string properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, "halo")
            Chai.expect(typeof result).eq("string")
        })

        it("Should convert number properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, "200")
            Chai.expect(typeof result).eq("number")
        })

        it("Should convert boolean properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, "True")
            Chai.expect(typeof result).eq("boolean")
        })

        it("Should convert undefined properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, undefined)
            Chai.expect(typeof result).eq("undefined")
        })

        it("Should convert object properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "defaultConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, { data: "Hello" })
            Chai.expect(result).deep.eq({ data: "Hello" })
        })
    })

    describe("Decorated Value Converter", () => {
        it("Should convert string properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, "halo")
            Chai.expect(typeof result).eq("string")
        })

        it("Should convert number properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[1]
            let result = Binder.convert(info, parameterMeta.name, "200")
            Chai.expect(typeof result).eq("number")
        })

        it("Should convert boolean properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[2]
            let result = Binder.convert(info, parameterMeta.name, "True")
            Chai.expect(typeof result).eq("boolean")
        })

        it("Should convert undefined properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, undefined)
            Chai.expect(typeof result).eq("undefined")
        })

        it("Should throw if provided object", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "decoratedConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            Chai.expect(() => Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .throw("Expected parameter type of [@type('string') str] but got object in [DummyApi.decoratedConversion controller/parameter-binder-controller.js]")
        })

        it("Should ignore string[]", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "arrayDecorated")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            Chai.expect(Binder.convert(info, parameterMeta.name, [{ data: "Hello" }]))
                .deep.eq([{ data: "Hello" }])
        })

        it("Should ignore number[]", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "arrayDecorated")[0]
            let parameterMeta = info.methodMetaData!.parameters[1]
            Chai.expect(Binder.convert(info, parameterMeta.name, [{ data: "Hello" }]))
                .deep.eq([{ data: "Hello" }])
        })

        it("Should ignore boolean[]", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "arrayDecorated")[0]
            let parameterMeta = info.methodMetaData!.parameters[2]
            Chai.expect(Binder.convert(info, parameterMeta.name, [{ data: "Hello" }]))
                .deep.eq([{ data: "Hello" }])
        })
    })

    describe("Convention Value Converter", () => {
        it("Should convert string properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, "halo")
            Chai.expect(typeof result).eq("string")
        })

        it("Should convert number properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[1]
            let result = Binder.convert(info, parameterMeta.name, "200")
            Chai.expect(typeof result).eq("number")
        })

        it("Should convert boolean properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[2]
            let result = Binder.convert(info, parameterMeta.name, "True")
            Chai.expect(typeof result).eq("boolean")
        })

        it("Should convert undefined properly", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            let result = Binder.convert(info, parameterMeta.name, undefined)
            Chai.expect(typeof result).eq("undefined")
        })

        it("Should throw if provided object on s<Name>", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[0]
            Chai.expect(() => Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .throw("Expected parameter type of \'string\'  but got object in [sName] [DummyApi.conventionConversion controller/parameter-binder-controller.js]")
        })

        it("Should throw if provided object on i<Name>", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[1]
            Chai.expect(() => Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .throw("Expected parameter type of \'number\'  but got object in [iAge] [DummyApi.conventionConversion controller/parameter-binder-controller.js")
        })

        it("Should throw if provided object on b<Name>", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[2]
            Chai.expect(() => Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .throw("Expected parameter type of \'boolean\'  but got object in [bIsDirty] [DummyApi.conventionConversion controller/parameter-binder-controller.js]")
        })

        it("Should not convert if parameter name after 'str' is lower case", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[3]
            Chai.expect(Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .deep.eq({ data: "Hello" })
        })

        it("Should not convert if parameter name after 'int' is lower case", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[4]
            Chai.expect(Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .deep.eq({ data: "Hello" })
        })

        it("Should not convert if parameter name after 'bool' is lower case", () => {
            let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
            let infos = Router.transform(meta)
            let info = infos.filter(x => x.methodMetaData!.name == "conventionConversion")[0]
            let parameterMeta = info.methodMetaData!.parameters[5]
            Chai.expect(Binder.convert(info, parameterMeta.name, { data: "Hello" }))
                .deep.eq({ data: "Hello" })
        })

    })

    it("Should prioritize @type decorator vs naming convention", () => {
        let meta = H.fromFile("controller/parameter-binder-controller.js", new DefaultPathResolver(__dirname))
        let infos = Router.transform(meta)
        let info = infos.filter(x => x.methodMetaData!.name == "priority")[0]
        let parameterMeta = info.methodMetaData!.parameters[0]
        let result = Binder.convert(info, parameterMeta.name, "abc")
        Chai.expect(typeof result).eq("number")
    })
})