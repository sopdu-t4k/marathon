'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rigger = require('gulp-rigger'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg'),
    gutil = require('gulp-util');

var path = {
    dist: {
        html: 'public_html/dist',
        css: 'public_html/dist/css',
        js: 'public_html/dist/js',
        img: 'public_html/dist/img',
        fonts: 'public_html/dist/fonts',
    },
    src: {
        html: 'public_html/src/*.html',
        style: 'public_html/src/css/main.scss',
        js: 'public_html/src/js/main.js',
        img: 'public_html/src/img/**/*.*',
        fonts: 'public_html/src/fonts/**/*.*',
    },
    watch: {
        html: 'public_html/src/**/*.html',
        scss: 'public_html/src/css/**/*.scss',
        js: 'public_html/src/js/**/*.js',
        img: 'public_html/src/img/**/*.*',
        fonts: 'public_html/src/fonts/**/*.*',
    },
    clean: './public_html/dist/*'
};

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'public_html/dist'
        }
    });
});

gulp.task('html:build', function() {
    return gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css:build', function() {
    return gulp.src(path.src.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(path.dist.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js:build', function() {
    return gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.dist.js))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('image:build', function() {
    return gulp.src(path.src.img)
    .pipe(cache(imagemin([
        imagemin.gifsicle({ interlaced: true }),
        mozjpeg({ quality: 80 }),
        pngquant(),
        imagemin.svgo({ plugins: [{ removeViewBox: false }] })
    ])))
    .pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean:image', function() {
    return del([path.dist.img]);
});

gulp.task('clean:dist', function() {
    return del([path.clean]);
});

gulp.task('build', gulp.series('clean:dist',
    gulp.parallel(
        'html:build',
        'css:build',
        'js:build',
        'image:build',
        'fonts:build'
    )
  )
);

gulp.task('watch', function() {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.scss, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('default', gulp.series('build',
    gulp.parallel('browserSync','watch')
));
