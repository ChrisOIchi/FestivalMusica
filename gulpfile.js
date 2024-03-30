const { src, dest, watch, parallel } = require("gulp");

//CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

//Imagenes
//const webp = require('gulp-webp');
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const avif = require("gulp-avif");

function css(done) {
  src("src/scss/**/*.scss") //Identificar el archivo de SASS
    .pipe(plumber()) //Evitar que se detenga el proceso
    .pipe(sass()) //compilar el archivo de SASS
    .pipe(dest("build/css")); //Almacenara en el disco duro

  done(); //callback que avisa a gulp cuando llegamos al final
}

async function versionWebp(done) {
  const { default: webp } = await import("gulp-webp");

  const opciones = {
    quality: 50,
  };

  src("src/img/**/*.{png,jpg}").pipe(webp(opciones)).pipe(dest("build/img"));

  done();
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3,
  };
  src("src/img/**/*.{png,jpg}")
    .pipe(cache(imagemin(opciones)))
    .pipe(dest("build/img"));
  done();
}

async function versionAvif(done) {
  const opciones = {
    quality: 50,
  };

  src("src/img/**/*.{png,jpg}")
  .pipe(avif(opciones))
  .pipe(dest("build/img"));

  done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css); //Observa los cambios en los archivos de SASS
  done();
}

exports.css = css;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, dev);
