// -Path: "cli/gulpfile.js"
const gulp = require("gulp");
const chmod = require("gulp-chmod");
const insert = require("gulp-insert");

gulp.task("release", () => {
    return gulp
        .src("dist/index.js")
        .pipe(insert.prepend("#!/usr/bin/env node\n"))
        .pipe(chmod(0o755)) // ใช้ chmod แทน
        .pipe(gulp.dest("dist"));
});

gulp.task("default", gulp.series("release"));
