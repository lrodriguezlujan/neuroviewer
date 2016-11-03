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
    'node_modules/jquery/dist/jquery.min.js'
  ]).pipe(gulp.dest('./dist/vendor'));
});

gulp.task('copy:static', function(){
  return gulp.src([
    'static/css/*'
  ]).pipe(gulp.dest('./dist/static/css'));
});

gulp.task('copy', function(done){
    return runSeq(['copy:package','copy:vendor', 'copy:static'], done);
});
