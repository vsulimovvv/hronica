const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const include = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const del = require('del');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// * ===== svgSprites
function svgSprites() {
  return src(['src/img/icons/*.svg'])
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true,
        },
      })
    )

    .pipe(replace('&gt,', '>'))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg', // sprite file name
          },
        },
      })
    )
    .pipe(dest('src/img'));
}

// * ===== fileInclude
function fileInclude() {
  return src('src/html/*.html')
    .pipe(
      include({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(dest('src'))
    .pipe(browserSync.stream());
}

// * ===== browsersync
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'src/',
    },
    notify: false,
  });
}

// * ===== styles
function styles() {
  return src('src/scss/style.scss')
    .pipe(
      scss({
        outputStyle: 'expanded',
      })
    )
    .pipe(concat('style.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true,
      })
    )
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

// * ===== scripts
function scripts() {
  return src(['src/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream());
}

// * ===== images
function images() {
  return src('src/img/**/*.*')
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imagemin.mozjpeg({
          quality: 75,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        }),
      ])
    )
    .pipe(dest('app/img'));
}

// * ===== webpImages
function webpImages() {
  return src('src/img/**/*.{jpg,jpeg,png}').pipe(webp()).pipe(dest('src/img'));
}

// * ===== build
function build() {
  return src(
    [
      'src/**/*.html',
      'src/css/style.css',
      'src/js/main.js',
      'src/js/main.min.js',
      'src/fonts/**',
      'src/img/**/*.*',
    ],
    {
      base: 'src',
    }
  ).pipe(dest('app'));
}

// * ===== cleanapp
function cleanapp() {
  return del('app');
}

// * ===== watching
function watching() {
  watch(['src/scss/**/*.scss'], styles);
  watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
  watch(['src/html/**/*.html'], fileInclude);
  watch(['src/**/*.html']).on('change', browserSync.reload);
  watch(['src/img/icons/*.svg'], svgSprites);
  watch(['src/img/**/*.*'], images);
  watch(['src/img/**/*.{jpg,jpeg,png}'], webpImages);
}

exports.svgSprites = svgSprites;
exports.fileInclude = fileInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.webpImages = webpImages;
exports.cleanapp = cleanapp;
exports.build = series(cleanapp, images, webpImages, build);

exports.default = parallel(
  fileInclude,
  svgSprites,
  styles,
  scripts,
  images,
  webpImages,
  browsersync,
  watching
);
