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


gulp.task('copy', function(done){
    return runSeq(['copy:package'], done);
});

