"use strict";


var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    jeditor = require("gulp-json-editor"),
    path = require("path");

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

function fixPackageJson(cb) {
    var name = "fixing: package.json"
    gulp.task(name, function () {
        return gulp.src("package.json")
            .pipe(jeditor(function (json) {
                cb(json)
                return json
            }))
            .pipe(gulp.dest("./"));
    });
    return name;
}

gulp.task("prepublish", function (cb) {
    runSequence(compile({ src: "src", dest: "lib", declaration:true }), fixPackageJson(function (json) {
        json.main = "lib/index.js";
        json.types = "lib/index.d.ts"
    }), cb)
});

gulp.task("postpublish", function (cb) {
    runSequence(fixPackageJson(function (json) {
        json.main = "src/index.js";
        json.types = "src/index.ts"
    }), cb)
});
