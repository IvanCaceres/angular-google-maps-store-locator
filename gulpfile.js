// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var browserify = require('gulp-browserify')
var concat = require('gulp-concat');
var del = require('del');
var debowerify = require('debowerify');
// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/', '!./app/node_modules/'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function (cb) {
  del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    './dist/**',
    // remove the old bundled js file
    './app/js/bundled.js'
  ], cb);
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-dependencies', function () {
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css.map')
    .pipe(gulp.dest('app/node_modules/bootstrap/dist/css/'));
});
gulp.task('copy-node-modules', function () {
  gulp.src('./node_modules/**')
    .pipe(gulp.dest('dist/node_modules'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
gulp.task('browserify', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: false,
    debug: false,
    transform: ['debowerify']
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./app/js'))
});
gulp.task('browserifyDist', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./dist/js'))
});

// default task
gulp.task('default',
  ['lint', 'browserify', 'connect']
);
// build task
gulp.task('build',
  ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-npm-components', 'connectDist']
);
