const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');

function css(done) {

  src('src/scss/**/*.scss') //Identificar el archivo de SASS
    .pipe( plumber() ) //Evitar que se detenga el proceso
    .pipe( sass() )   //compilar el archivo de SASS
    .pipe( dest('build/css') );  //Almacenara en el disco duro

    done(); //callback que avisa a gulp cuando llegamos al final
}

function dev(done) {
  watch('src/scss/**/*.scss', css); //Observa los cambios en los archivos de SASS
  done();
}

exports.dev = dev; //Exportar la tarea
exports.css = css; //Exportar la tarea