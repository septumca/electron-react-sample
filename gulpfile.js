var gulp = require('gulp');
var browserify = require('browserify');
var glob = require('glob');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('js', function () {

    const src_files = glob.sync('./src/**/*.js');

    return browserify({
        entries:src_files,
        debug: true
    })
    .transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));

});