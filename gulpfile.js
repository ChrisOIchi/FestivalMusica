const { src, dest, watch, parallel } = require("gulp");

//CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

//Javascript
const terser = require("gulp-terser-js");

//Imagenes
//const webp = require('gulp-webp');
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const avif = require("gulp-avif");

function css(done) {
  src("src/scss/**/*.scss") //Identificar el archivo de SASS
    .pipe(sourcemaps.init()) //Iniciar el mapeo de los archivos
    .pipe(plumber()) //Evitar que se detenga el proceso
    .pipe(sass()) //compilar el archivo de SASS
    .pipe(postcss([autoprefixer(), cssnano()])) //Añadir prefijos y minificar el CSS
    .pipe(sourcemaps.write(".")) //Escribir los mapas
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

function javascript(done) {
  src("src/js/**/*.js")
  .pipe(sourcemaps.init())
  .pipe(terser())
  .pipe(sourcemaps.write("."))
  .pipe(dest("build/js"));
  done();
}


function dev(done) {
  watch("src/scss/**/*.scss", css); //Observa los cambios en los archivos de SASS
  watch("src/js/**/*.js", javascript); 
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
