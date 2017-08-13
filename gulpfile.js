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
    "packages/kamboja-foundation",
    "packages/kamboja-socket.io",
    "packages/kamboja-mongoose",
    "packages/kamboja",
]

//********CLEAN ************
function fixPackageJson(filePath, cb) {
    var file = path.join(filePath, "/package.json")
    var dest = path.join(filePath)
    var name = "fixing: " + file
    gulp.task(name, function () {
        return gulp.src(file)
            .pipe(jeditor(function (json) {
                cb(json)
                return json
            }))
            .pipe(gulp.dest(dest));
    });
    return name;
}

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
        "./packages/*/node_modules/@types/chai",
        "./packages/*/node_modules/@types/socket.io-client",
        "./packages/*/node_modules/@types/socket.io",
        "./packages/*/node_modules/@types/validator"],
        cb)
})

gulp.task("fix-package.json", function (cb) {
    var buildSequence = []
    for (var i = 0; i < PACKAGES.length; i++) {
        var pack = PACKAGES[i];
        buildSequence.push(fixPackageJson(pack, function (json) {
            json.main = "src/index.js";
            json.types = "src/index.ts"
        }))
    }
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});

gulp.task("clean", function (cb) {
    runSequence("clean-source", "clean-test", "clean-lib", "fix-package.json", cb);
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
    if (!opt.tsconfig) opt.tsconfig = "tsconfig.json"
    var tsProject = tsc.createProject(opt.tsconfig, {
        declaration: opt.declaration,
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
        buildSequence.push(compile({ src: pack + "/src", tsconfig: "tsconfig-es5.json" }))
        buildSequence.push(compile({ src: pack + "/test", tsconfig: "tsconfig-es5.json" }))
    }
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});


//******** PRE PUBLISH *************

gulp.task("prepublish", function (cb) {
    var buildSequence = []
    for (var i = 0; i < PACKAGES.length; i++) {
        var pack = PACKAGES[i];
        buildSequence.push(compile({ src: pack + "/src", dest: pack + "/lib", declaration: true, tsconfig: "tsconfig-es5.json" }))
        buildSequence.push(fixPackageJson(pack, function (json) {
            json.main = "lib/index.js";
            json.types = "lib/index.d.ts"
        }))
    }
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});

//******** TEST *************
//this task used for debugging from VSCode
gulp.task("test-debug", function() {
    return gulp.src(PACKAGES.map(function(x) { return x + "/test/**/*.js" }))
        .pipe(mocha());
});

gulp.task("pre-test", function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/src/**/*.js" }))
        .pipe(istanbul({ includeUntested: false }))
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/test/**/*.js" }))
        .pipe(mocha({ timeout: 10000 }))
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