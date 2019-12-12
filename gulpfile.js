const { src, dest, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const clean = require('gulp-clean');

const SRC_DIR = './src';
const DIST_DIR = './dist';

function cleanDist() {
  return src(DIST_DIR, { read: false, allowEmpty: true })
    .pipe(clean());
}

function compileSCSS() {
  return src(`${SRC_DIR}/scss/**/*.scss`)
    .pipe(sass())
    .pipe(dest(`${DIST_DIR}/css`));
}

function moveJS() {
  return src(`${SRC_DIR}/js/**/*.js`)
    .pipe(dest(`${DIST_DIR}/js`));
}

function injectStatic() {
  const cssFiles = src(`${DIST_DIR}/css/**/*.css`, { read: false });
  const jsFiles = src(`${DIST_DIR}/js/**/*.js`, { read: false });

  return src(`${SRC_DIR}/index.html`)
    .pipe(inject(cssFiles))
    .pipe(inject(jsFiles))
    .pipe(dest(DIST_DIR));
}

exports.clean = cleanDist;
exports.default = series(
  cleanDist,
  parallel(compileSCSS, moveJS),
  injectStatic,
);
