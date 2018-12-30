const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const through = require('through');
const log = require('fancy-log');
const colors = require('ansi-colors');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sassVariables = require('gulp-sass-variables');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

const config = {
    source: null,
    destination: null,

    sassVariables: {},

    // http://cssnano.co/options/
    cssnano: {
        autoprefixer: false,
        zindex: false,
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false
    },
};

class StylesTask extends Task {
    run(done) {
        let hasErrors = false;

        const postcssPlugins = [
            postcssImport(),
            autoprefixer(),
        ];

        if (this.isProduction()) {
            postcssPlugins.push(cssnano(this.config.cssnano));
        }

        return gulp.src(this.config.source)

            .pipe(!this.isProduction() ? sourcemaps.init() : through())

            // prevent pipe breaking caused by errors
            .pipe(plumber())

            // glob partials (use wildcard * for imports)
            .pipe(sassGlob())

            .pipe(sassVariables(this.config.sassVariables))

            .pipe(sass())

            .on('error', function (err) {

                hasErrors = true;

                log(colors.bold(colors.red(err.name + ': ' + err.message)));

                notifier.notify({
                    title: 'ROARRRRRRRRRR!',
                    message: 'Styles gone wrong.',
                    sound: 'Basso',
                    contentImage: __dirname + '/../../assets/fail.png'
                });

                done();
            })

            .pipe(postcss(postcssPlugins))

            // stop error prevention
            .pipe(plumber.stop())

            .pipe(size({title: colors.white('Generated Style:'), showFiles: true}))

            .pipe(!this.isProduction() ? sourcemaps.write('.') : through())

            .pipe(gulp.dest(this.config.destination))

            // make browersync reload CSS only!
            .pipe(browserSync.stream({match: '**/*.css'}));
    }

    defaultWatch() {
        this.watch(this.config.source.replace(/\/[^\/]*\.scss$/, '/**/*.scss'));
    }
}

const task = new MultiTask('styles', config, StylesTask);

gulp.task(task.gulpTask());

module.exports = task;
