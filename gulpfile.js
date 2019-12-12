const { src, dest, series } = require('gulp');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const clean = require('gulp-clean');

const paths = (() => {
  const SRC_DIR = './src';
  const SRC_SCSS_DIR = `${SRC_DIR}/scss`;

  const DIST_DIR = './dist';
  const DIST_CSS_DIR = `${DIST_DIR}/css`;

  return {
    SRC_DIR,
    SRC_SCSS_DIR,
    DIST_DIR,
    DIST_CSS_DIR,
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

function injectCss() {
  const cssFiles = src(`${paths.DIST_CSS_DIR}/**/*.css`, { read: false });

  return src('./src/index.html')
    .pipe(inject(cssFiles))
    .pipe(dest(paths.DIST_DIR));
}

exports.clean = cleanDist;
exports.default = series(
  cleanDist,
  compileSCSS,
  injectCss,
);
