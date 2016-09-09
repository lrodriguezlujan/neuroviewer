var gulp = require('gulp');
var del = require('del');
var runSeq = require('run-sequence');
var symdest = require('gulp-symdest');
var electron = require('gulp-atom-electron');

gulp.task('clean:dist', function(){
    return del('dist/**/*', {force:true});
});

gulp.task('clean:build', function(){
    return del('build/**/*', {force:true});
});

gulp.task('clean', function(done){
    return runSeq(['clean:build', 'clean:dist', 'clean:packages'], done);
});

gulp.task('copy:vendor', function(){
    return gulp.src([
            "node_modules/core-js/client/shim.min.js",
            "node_modules/zone.js/dist/zone.js",
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/typescript/lib/typescript.js",
            "node_modules/angular2-polyfill/bundles/angular2-polyfill.js"
        ])
        .pipe(gulp.dest('./dist/scripts/vendor'))
});

gulp.task('copy:nv', function(){
    return gulp.src([
            "neuroviewer_project/neuroviewer/**/*.js",
        ])
        .pipe(gulp.dest('./dist/scripts/neuroviewer'))
});

gulp.task('copy:angular', function(){
    return gulp.src("node_modules/@angular/**/*.js")
        .pipe(gulp.dest('./dist/node_modules/@angular'))
});

gulp.task('copy:angular2-material', function(){
    return gulp.src("node_modules/@angular2-material/**/*.js")
        .pipe(gulp.dest('./dist/node_modules/@angular2-material'))
});

gulp.task('copy:rxjs', function(){
    return gulp.src("node_modules/rxjs/**/*.js")
        .pipe(gulp.dest('./dist/node_modules/rxjs'))
});

gulp.task('copy:electron', function(){
    return gulp.src("node_modules/electron/**/*.js")
        .pipe(gulp.dest('./dist/node_modules/electron'))
});

gulp.task('copy:nodemodules', function(done){
    return runSeq(['copy:angular', 'copy:angular2-material', 'copy:rxjs'], done);
})

gulp.task('copy:styles', function(){
    return gulp.src("./src/frontend/styles/**/*.css")
        .pipe(gulp.dest('./dist/styles'))
});

gulp.task('copy:templates', function(){
    return gulp.src("./src/frontend/templates/**/*.html")
        .pipe(gulp.dest('./dist/templates'))
});


gulp.task('copy:index', function(){
    return gulp.src([
        './src/frontend/index.html',
        './src/frontend/systemjs.config.js'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy:frontendts', function(){
    return gulp.src('./build/frontend/**/*')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('frontend', function(done){
    return runSeq(['copy:vendor', 'copy:nodemodules' , 'copy:index', 'copy:styles', 'copy:templates', 'copy:frontendts'], done);
})

gulp.task('copy:electron', function(){
    return gulp.src('./build/electron/**/*')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy:manifest', function(){
    return gulp.src('./src/package.json')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('electron', function(done){
    return runSeq(['copy:electron', 'copy:manifest'], done);
});

gulp.task('build-app-for-osx', function(){
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.3.5',
            arch: 'x64',
            platform: 'darwin' }))
        .pipe(symdest('packages/osx'));
});
gulp.task('build-app-for-linux', function(){
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.3.5',
            arch: 'x64',
            platform: 'linux' }))
        .pipe(symdest('packages/linux'));
});
gulp.task('build-app-for-win', function(){
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.3.5',
            arch: 'x64',
            platform: 'win32' }))
        .pipe(symdest('packages/win'));
});

gulp.task('apps', function(done){
    return runSeq(['build-app-for-win', 'build-app-for-linux', 'build-app-for-osx'], done);
});

gulp.task('clean:packages', function(){
    return del('packages/**/*', {force:true});
});
