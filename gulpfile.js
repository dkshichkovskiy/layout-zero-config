const { src, dest, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const clean = require('gulp-clean');

const paths = (() => {
  const SRC_DIR = './src';
  const SRC_SCSS_DIR = `${SRC_DIR}/scss`;
  const SRC_JS_DIR = `${SRC_DIR}/js`;

  const DIST_DIR = './dist';
  const DIST_CSS_DIR = `${DIST_DIR}/css`;
  const DIST_JS_DIR = `${DIST_DIR}/js`;

  return {
    SRC_DIR,
    SRC_SCSS_DIR,
    SRC_JS_DIR,
    DIST_DIR,
    DIST_CSS_DIR,
    DIST_JS_DIR,
  };
})();

function cleanDist() {
  return src(paths.DIST_DIR, { read: false, allowEmpty: true })
    .pipe(clean());
}

function compileSCSS() {
  return src(`${paths.SRC_SCSS_DIR}/**/*.scss`)
    .pipe(sass())
    .pipe(dest(paths.DIST_CSS_DIR));
}

function moveJS() {
  return src(`${paths.SRC_JS_DIR}/**/*.js`)
    .pipe(dest(paths.DIST_JS_DIR));
}

function injectStatic() {
  const cssFiles = src(`${paths.DIST_CSS_DIR}/**/*.css`, { read: false });
  const jsFiles = src(`${paths.DIST_JS_DIR}/**/*.js`, { read: false });

  return src(`${paths.SRC_DIR}/index.html`)
    .pipe(inject(cssFiles))
    .pipe(inject(jsFiles))
    .pipe(dest(paths.DIST_DIR));
}

exports.clean = cleanDist;
exports.default = series(
  cleanDist,
  parallel(compileSCSS, moveJS),
  injectStatic,
);
