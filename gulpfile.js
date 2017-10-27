var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require("gulp-sass");
var concat = require('gulp-concat');

var controllerSources = ['./src/**/**.**.js'];
var angularScripts = ['./src/javascript/**.js'];

gulp.task('css', function() {
    return gulp.src('sass/*.scss')
        .pipe(sass()).on('error',sass.logError)
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', function() {
    gulp.watch('sass/*.scss', ['css']);
    gulp.watch(controllerSources, ["controllers"]);
    gulp.watch(angularScripts, ["scripts"]);
    gulp.watch("./src/**",['moveStatics'])
});

gulp.task('moveStatics', [], function() {
    console.log("Moving all files in styles folder");
    gulp.src("./src/**/**.html")
        .pipe(gulp.dest('public/tpls'));
});

gulp.task('start', ["moveStatics"], function () {
    nodemon({
        script: 'bin/www',
        ext: 'js html',
        ignore: []
    })
    .on('restart', function(){

    }).on('change', ['watch'])
});

gulp.task('scripts', function() {
    return gulp.src(angularScripts)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('controllers', function() {
    return gulp.src(controllerSources)
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('default', ['controllers','scripts','css','start','watch']);