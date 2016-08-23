var gulp = require("gulp"),
    rollup = require("gulp-rollup"),
    closureCompiler = require("gulp-closure-compiler"),
    rename = require("gulp-rename"),
    jsdoc = require('gulp-jsdoc3');

/** Bundles ES6 modules together with Rollup **/
gulp.task("bundle", function() {
  return gulp.src("./src/**/*.js")
    // transform the files here.
    .pipe(rollup({
      // any option supported by Rollup can be set here.
      entry: "./src/main.js",
      format: "cjs"
    }))
    .pipe(rename("hypno.js"))
    .pipe(gulp.dest("./build"));
});

/** Use Google Closure Compiler to minify the output produced by Rollup **/
gulp.task("minify", function() {
  return gulp.src("build/hypno.js")
    .pipe(closureCompiler({
      compilerPath: "node_modules/gulp-closure-compiler/node_modules/google-closure-compiler/compiler.jar",
      fileName: "build/hypno.min.js",
      compilerFlags: {
        language_in: "ECMASCRIPT6_STRICT",
        language_out: "ES5_STRICT",
        warning_level: "QUIET"
      }
    }))
    .pipe(gulp.dest("."));
});

/** Generate documentation with JSDoc **/
gulp.task('doc', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});

gulp.task("default",[
  "bundle",
  "minify"
]);

gulp.task("build", [
  "bundle",
  "doc",
  "minify"
]);

gulp.task("dev", [
  "bundle"
]);
