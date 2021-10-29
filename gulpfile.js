var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require ('gulp-sass') (require ('sass'));
var autoprefixer = require('gulp-autoprefixer');
var group_media = require('gulp-group-css-media-queries');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
let clean_css = require('gulp-clean-css');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');

// название темы
var themeName = 'UkrArtists';

// название темы
var domName = 'ukrArtist2.loc';

gulp.task('serve', function(done) {

    browserSync.init({
        // proxy: 'http://' + domName + ':8080/',
        proxy: 'http://' + domName,
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

// scss -> min.css
gulp.task('sass', function(done) {
    gulp.src("wp-content/themes/" + themeName + "/scss/main.scss") // путь к scss файлам
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

// scss -> css
gulp.task('sass-css', function(done) {
    gulp.src("wp-content/themes/" + themeName + "/scss/main.scss") // путь к scss файлам
        .pipe(sourcemaps.init())
        
        .pipe(sass())
        .pipe(group_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
            )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/css")) //папка для выгрузки css файлов
            
        .pipe(browserSync.stream());
    done();
});

gulp.task('fonts', function(done) {
	gulp.src("wp-content/themes/" + themeName + "/fonts/ttf/**/*.ttf")
		.pipe(ttf2woff())
		.pipe(gulp.dest("wp-content/themes/" + themeName + "/fonts/woff"));
	gulp.src("wp-content/themes/" + themeName + "/fonts/ttf/**/*.ttf")
		.pipe(ttf2woff2())
		.pipe(gulp.dest("wp-content/themes/" + themeName + "/fonts/woff2"));
        done();
});


gulp.task('default', gulp.series('sass', 'sass-css', 'serve'), gulp.parallel('fonts'));
