var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    connect = require('gulp-connect'),
    sass    = require('gulp-sass');


gulp.task('server', function() {
  connect.server();
});

gulp.task('ci', function() {
  return gulp.src([
    'js/*',
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default', { verbose: true }))
  .pipe(jshint.reporter('fail'));
});



gulp.task('watch', function() {
});

