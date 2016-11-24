var gulp = require('gulp');
var del = require('del');
var runSeq = require('run-sequence');
var dts = require('dts-generator');


gulp.task('clean:dist', function(){
    return del('dist/**/*', {force:true});
});

gulp.task('clean', function(done){
    return runSeq(['clean:dist'], done);
});

gulp.task('copy:vendor', function(){
    return gulp.src([
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/babylonjs/babylon.js",
            "node_modules/handjs/hand.min.js",
            "node_modules/@neuroviewer/control/vendor/*.js",
            "static/scripts/babylon.gridMaterial.js"
        ])
        .pipe(gulp.dest('./dist/scripts/vendor'))
});

gulp.task('copy:neuroviewer', function(){
    return gulp.src([
            'node_modules/@neuroviewer/**/*.js'
        ])
        .pipe(gulp.dest('./dist/scripts/neuroviewer'))
});

gulp.task('copy:neuroviewer_static', function(){
    return gulp.src([
          'node_modules/@neuroviewer/control/static/**'
        ])
        .pipe(gulp.dest('./dist'))
});

gulp.task('copy:web', function(){
    return gulp.src([
            'static/index.html',
            'static/system.config.js'
        ])
        .pipe(gulp.dest('./dist'))
});

gulp.task('copy:data', function(){
    return gulp.src([
          'data/**/*'
        ])
        .pipe(gulp.dest('./dist/data'))
});

gulp.task('copy', function(done){
    return runSeq(['copy:vendor','copy:neuroviewer','copy:web','copy:data','copy:neuroviewer_static'], done);
});
