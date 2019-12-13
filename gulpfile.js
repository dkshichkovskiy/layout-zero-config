const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const clean = require('gulp-clean');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();

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

  const pugHeadView = src(`${SRC_DIR}/views/entry-head.pug`).pipe(pug({ pretty: true }));
  const pugBodyView = src(`${SRC_DIR}/views/entry-body.pug`).pipe(pug({ pretty: true }));

  const pugTransformFn = (filePath, file) => file.contents.toString('utf8');
  const resourceTransformFn = (filePath, file, index, length, targetFile) =>
    inject.transform.call(inject.transform, filePath.replace('/dist', '.'), file, index, length, targetFile);

  return src(`${SRC_DIR}/index.html`)
    .pipe(inject(cssFiles, {
      removeTags: true,
      transform: resourceTransformFn,
    }))
    .pipe(inject(jsFiles, {
      removeTags: true,
      transform: resourceTransformFn,
    }))
    .pipe(inject(pugHeadView, {
      starttag: '<!-- inject:head:{{ext}} -->',
      transform: pugTransformFn,
      removeTags: true,
    }))
    .pipe(inject(pugBodyView, {
      starttag: '<!-- inject:body:{{ext}} -->',
      transform: pugTransformFn,
      removeTags: true,
    }))
    .pipe(dest(DIST_DIR));
}

exports.clean = cleanDist;

exports.default = series(
  cleanDist,
  parallel(compileSCSS, moveJS),
  injectStatic,
);

exports.watch = function() {
  browserSync.init({
    server: { baseDir: DIST_DIR },
  });

  watch([
    `${SRC_DIR}/scss/**/*.scss`,
    `${SRC_DIR}/js/**/*.js`,
    `${SRC_DIR}/views/**/*.pug`,
  ], { ignoreInitial: false }, exports.default)
    .on('change', browserSync.reload);
};
