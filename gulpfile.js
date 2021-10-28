var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('sass', function(done) {
    gulp.src("scss/*.scss") // путь к scss файлам
        .pipe(sass())
        .pipe(gulp.dest("css/")) //папка для выгрузки css файлов
        .pipe(browserSync.stream());
    done();
});

gulp.task('serve', function(done) {

    browserSync.init({
        proxy: 'http://ukrArtist3.loc/',
        host: 'ukrArtist3.loc',
        open: 'external'
    });

    gulp.watch("scss/*.scss", gulp.series('sass')).on('change', () => {
        browserSync.reload();
        done();
        });
    gulp.watch("*.php").on('change', () => {
        browserSync.reload();
        done();
    });

    done();
});

gulp.task('default', gulp.series('sass', 'serve'));
