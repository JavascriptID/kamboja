import * as Chai from "chai"
import * as Core from "kamboja-core"
import { Router } from "../../src"
import { DefaultIdentifierResolver, DefaultPathResolver, QualifiedName } from "../../src/resolver"
import * as H from "../helper"
import { Kamboja } from "../../src/kamboja"

describe("MetaDataLoader", () => {

    describe("load", () => {
        let loader: Router.MetaDataLoader;

        beforeEach(() => {
            loader = new Router.MetaDataLoader(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        })

        it("Should load classes properly", () => {
            loader.load("controller", "Controller")
            let result = loader.getFiles("Controller")
            Chai.expect(result.length).eq(2)
        })

        it("Should able to load from multiple directory", () => {
            loader.load(["controller", "model"], "Controller")
            let result = loader.getFiles("Controller")
            Chai.expect(result.length).eq(3)
        })

        it("Should throw when directory not found on load controller", () => {
            Chai.expect(() => {
                loader.load(["controller", "not/a/directory"], "Controller")
            }).throw(/Directory not found/)
        })

        it("Should not throw when directory found on load model", () => {
            loader.load(["not/a/directory"], "Model")
            let result = loader.getClasses("Model")
            Chai.expect(result.length).eq(0)
        })
    })

    describe("get", () => {
        let storage: Router.MetaDataLoader;

        beforeEach(() => {
            storage = new Router.MetaDataLoader(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        })

        it("Should return class by qualified name properly", () => {
            storage.load("controller", "Controller")
            let result = storage.get("DummyController, controller/dummy-controller.js")
            Chai.expect(result!.name).eq("DummyController")
        })

        it("Should provide qualifiedClassName properly", () => {
            storage.load("controller", "Controller")
            let result = storage.get("DummyController, controller/dummy-controller.js")
            let q = new QualifiedName(result!.qualifiedClassName, new DefaultPathResolver(__dirname))
            Chai.expect(q.equals("DummyController, controller/dummy-controller")).true
        })

        it("Should not return if provided wrong namespace", () => {
            storage.load("controller", "Controller")
            let result = storage.get("MyNamespace.DummyController, controller/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error if provided namespace without classes", () => {
            storage.load("no-class", "Controller")
            let result = storage.getClasses("Controller")
            Chai.expect(result.length).eq(0)
        })

        it("Should return class by qualified name in deep namespace", () => {
            storage.load("with-deep-namespace", "Controller")
            let result = storage.get("MyParentNamespace.MyChildNamespace.DummyController, with-deep-namespace/dummy-controller.js")
            Chai.expect(result!.name).eq("DummyController")
        })

        it("Should not return class if provided only class name on deep namespace", () => {
            storage.load("with-deep-namespace", "Controller")
            let result = storage.get("DummyController, with-deep-namespace/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error when no classes found", () => {
            storage.load("controller", "Controller")
            let result = storage.get("OtherNonExistController, controller/dummy-controller.js")
            Chai.expect(result).undefined
        })

        it("Should not error when no file found", () => {
            storage.load("controller", "Controller")
            let result = storage.get("DummyController, not/the/correct/path")
            Chai.expect(result).undefined
        })
    })
})
