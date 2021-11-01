var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require ('gulp-sass') (require ('sass'));
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
let clean_css = require('gulp-clean-css');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let uglify = require('gulp-uglify-es').default;
let fileinclude = require('gulp-file-include');

// название темы
var themeName = 'fitness-hub';

// название темы
var domName = '11test.loc';

gulp.task('serve', function(done) {

    browserSync.init({
        proxy: 'http://' + domName + ':8080/',
        // proxy: 'http://' + domName,
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

    gulp.watch("wp-content/themes/" + themeName + "/js/Main.js", gulp.series('js')).on('change', () => {
        browserSync.reload();
        done();
    });

    gulp.watch("wp-content/themes/" + themeName + "/js/includes/*.js", gulp.series('js')).on('change', () => {
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

gulp.task('js', function(done) {
	gulp.src("wp-content/themes/" + themeName + "/js/**/Main.js")
        .pipe(fileinclude())
		.pipe(rename("main.min.js"))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
		.pipe(gulp.dest("wp-content/themes/" + themeName + "/js"))
		.pipe(browserSync.stream())
    done();
});

gulp.task('directories', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/fonts"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/fonts/ttf"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/fonts/woff"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/fonts/woff2"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/scss"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/scss/includes"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/js"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/js/libraries"))
        .pipe(gulp.dest("wp-content/themes/" + themeName + "/js/includes"))
});

gulp.task('default', gulp.series('directories', 'sass', 'sass-css', 'js', 'serve'), gulp.parallel('fonts'));