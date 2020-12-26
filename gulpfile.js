"use strict";
var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  del = require("del"),
  imagemin = require("gulp-imagemin"),
  usemin = require("gulp-usemin"),
  uglify = require("gulp-uglify"),
  cleanCss = require("gulp-clean-css"),
  htmlmin = require("gulp-htmlmin"),
  flatmap = require("gulp-flatmap"),
  rev = require("gulp-rev");

gulp.task("sass", function () {
  return gulp
    .src("./css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"));
});

gulp.task("sass:watch", function () {
  gulp.watch("./css/*.scss", gulp.series("sass"));
});

gulp.task("browser-Sync", function () {
  var files = ["./*.html", "./css/*.css", "./js/*.js", "./img/*.{jpg,gif,png}"];
  browserSync.init(files, {
    server: {
      baseDir: "./",
    },
  });
});
gulp.task("default", gulp.parallel("browser-Sync", "sass:watch"));
gulp.task("clean", function () {
  return del(["dist"]);
});
gulp.task("copyfonts", function () {
  return gulp
    .src("./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*")
    .pipe(gulp.dest("./dist/fonts"));
});
gulp.task("imagemin", function () {
  return gulp
    .src("./img/*.{jpg,gif,png}")
    .pipe(
      imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
      })
    )
    .pipe(gulp.dest("dist/img"));
});

gulp.task("usemin", function () {
  return gulp
    .src("./*.html")
    .pipe(
      flatmap(function (stream, file) {
        return stream.pipe(
          usemin({
            css: [rev],
            html: [
              function () {
                return htmlmin({
                  collapseWhitespace: true,
                });
              },
            ],
            js: [uglify(), rev()],
            inlinecss: [cleanCss(), "concat"],
            inlinejs: [uglify()],
          })
        );
      })
    )

    .pipe(gulp.dest("dist/"));
});
gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("imagemin", "copyfonts", "usemin"))
);
