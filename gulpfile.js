"use strict";


var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    del = require("del"),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    fs = require("fs"),
    jeditor = require("gulp-json-editor"),
    path = require("path"),
    lodash = require("lodash"),
    istanbul = require("gulp-istanbul");

var PACKAGES = [
    "packages/kecubung",
    "packages/kamboja-core",
    "packages/kamboja-testing",
    "packages/kamboja",
    "packages/kamboja-express",
    "packages/kamboja-mongoose"
]

//********CLEAN ************
gulp.task("clean-source", function (cb) {
    return del([
        "./packages/*/src/**/*.js",
        "./packages/*/src/**/*.d.ts",
        "./packages/*/src/**/*.js.map"
    ], cb)
})

gulp.task("clean-test", function (cb) {
    return del([
        "./packages/*/test/**/*.js",
        "./packages/*/test/**/*.d.ts",
        "./packages/*/test/**/*.js.map"
    ], cb)
})

gulp.task("clean-lib", function (cb) {
    return del([
        "./coverage",
        "./packages/*/lib",
        /* 
            reflect-metadata need to removed in packages children
            due to issue with global value which referencing different
            reflect-metadata library
        */
        "./packages/*/node_modules/reflect-metadata",
        /*
            @types/chai need to removed due to typescript issue
            reporting duplicate operator error 
        */
        "./packages/*/node_modules/@types/chai"],
        cb)
})


gulp.task("clean", function (cb) {
    runSequence("clean-source", "clean-test", "clean-lib", cb);
});

//******** FIXING PACKAGE JSON **********

function fixPackageJson(filePath){
    var file = path.join(process.cwd(), filePath, "/package.json")
    var dest = path.join(process.cwd(), filePath)
    var name = "adding package.json: " + filePath
    gulp.task(name, function () {
        return gulp.src(file)
            .pipe(jeditor(function(json){
                json.main = "src/index.js";
                json.types = "src/index.ts"
                return json
            }))
            .pipe(gulp.dest(dest));
    });
    return name;
}


gulp.task("fix-package.json", function (cb) {
    var buildSequence = []
    for (var i = 0; i < PACKAGES.length; i++) {
        var pack = PACKAGES[i];
        buildSequence.push(fixPackageJson(pack))
    } 
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});

//******** BUILD *************

/**
 * Compile typescript
 * @param {*} option declaration, src, dest
 */
function compile(opt) {
    var name = "compiling: " + opt.src;
    if (!opt.declaration) opt.declaration = false;
    if (!opt.dest) opt.dest = opt.src;
    var tsProject = tsc.createProject("tsconfig.json", {
        declaration: opt.declaration,
        noResolve: false,
        typescript: require("typescript")
    });

    gulp.task(name, function () {
        return gulp.src([opt.src + "/**/*.ts"])
            .pipe(tsProject())
            .on("error", function (err) {
                process.exit(1);
            })
            .pipe(gulp.dest(opt.dest));
    });
    return name;
}


gulp.task("build", function (cb) {
    var buildSequence = []
    for (var i = 0; i < PACKAGES.length; i++) {
        var pack = PACKAGES[i];
        buildSequence.push(compile({ src: pack + "/src", declaration: true }))
        buildSequence.push(compile({ src: pack + "/test" }))
    } 
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});



//******** TEST *************

gulp.task("test-debug", function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/test/**/*.js" }))
        .pipe(mocha());
});

gulp.task("pre-test", function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/src/**/*.js" }))
        .pipe(istanbul({ includeUntested: false }))
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/test/**/*.js" }))
        .pipe(mocha())
        .pipe(istanbul.writeReports());
});

/** DEFAULT */
gulp.task("default", function (cb) {
    runSequence(
        "clean",
        "fix-package.json",
        "build",
        "test",
        cb);
}); 