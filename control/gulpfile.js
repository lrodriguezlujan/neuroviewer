var gulp = require('gulp');
var del = require('del');
var runSeq = require('run-sequence');


gulp.task('clean:dist', function(){
    return del('dist/**/*', {force:true});
});

gulp.task('clean', function(done){
    return runSeq(['clean:dist'], done);
});

gulp.task('copy:package', function(){
    return gulp.src([
            "LICENSE",
            "package.json",
            "typings.json"])
        .pipe(gulp.dest('./dist/'))
});

gulp.task('copy:vendor', function(){
  return gulp.src([
    'node_modules/interact.js/dist/interact.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
  ]).pipe(gulp.dest('./dist/vendor'));
});

gulp.task('copy:css', function(){
  return gulp.src([
    'static/css/*',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'
  ]).pipe(gulp.dest('./dist/static/css'));
});

gulp.task('copy:fonts', function(){
  return gulp.src([
    'node_modules/bootstrap/dist/fonts/*'
  ]).pipe(gulp.dest('./dist/static/fonts'));
});

gulp.task('copy', function(done){
    return runSeq(['copy:package','copy:vendor', 'copy:fonts', 'copy:css'], done);
});
