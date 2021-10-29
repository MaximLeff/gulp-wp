var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require ('gulp-sass') (require ('sass'));
var autoprefixer = require('gulp-autoprefixer');
// var group_media = require('gulp-group-css-media-queries');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
let clean_css = require('gulp-clean-css');

// название темы
var themeName = 'fitness-hub';

// название темы
var domName = '11test.loc';



gulp.task('sass', function(done) {
    gulp.src("wp-content/themes/" + themeName + "/scss/*.scss") // путь к scss файлам
        .pipe(sourcemaps.init())
        
        .pipe(sass())
        // .pipe(group_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
            )
            .pipe(clean_css({ 
                level: { 2: 
                    { restructureRules: true } 
                } 
            }))
            .pipe(
                rename({
                    extname: ".min.css"
                })
                )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/css")) //папка для выгрузки css файлов
            
        .pipe(browserSync.stream());
    done();
});

gulp.task('serve', function(done) {

    browserSync.init({
        proxy: 'http://' + domName + ':8080/',
        host: domName,
        open: 'external'
    });

    gulp.watch("wp-content/themes/" + themeName + "/scss/*.scss", gulp.series('sass')).on('change', () => {
        browserSync.reload();
        done();
    });

    gulp.watch("**/*.php").on('change', () => {
        browserSync.reload();
        done();
    });

    done();
});

gulp.task('default', gulp.series('sass', 'serve'));
