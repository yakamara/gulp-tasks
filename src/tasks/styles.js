import Task from '../Task';
import MultiTask from '../MultiTask';
import gulp from 'gulp';
import through from 'through';
import log from 'fancy-log';
import colors from 'ansi-colors';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import sassVariables from 'gulp-sass-variables';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import browserSync from 'browser-sync';
import size from 'gulp-size';
import plumber from 'gulp-plumber';
import notifier from 'node-notifier';

const sass = gulpSass(dartSass);

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

export default task;
