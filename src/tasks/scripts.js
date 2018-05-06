const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const through = require('through');
const log = require('fancy-log');
const colors = require('ansi-colors');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const size = require('gulp-size');
const notifier = require('node-notifier');
const path = require('path');

const config = {
    source: null,
    files: '*.js',
    destination: null,
};

class ScriptsTask extends Task {
    run() {
        const b = browserify({
            entries: this.config.source,
            cache: {},
            packageCache: {},
            plugin: this.isWatchingEnabled() ? [watchify] : [],
        });

        b.transform("babelify", {
            presets: ["env"]
        });

        const bundle = () => b.bundle()
            .on('error', function (err) {

                log(colors.bold(colors.red(err.name + ': ' + err.message)));

                notifier.notify({
                    title: 'ROARRRRRRRRRR!',
                    message: 'JavaScript gone wrong.',
                    sound: 'Basso',
                    contentImage: __dirname + '/../../assets/fail.png'
                });
            })
            .pipe(source(path.basename(this.config.source)))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(this.isProduction() ? uglify() : through())
            .pipe(size({title: colors.white('Generated Script:'), showFiles: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(this.config.destination))
            .pipe(browserSync.stream());

        b.on('update', bundle);

        return bundle();
    }
}

const task = new MultiTask('scripts', config, ScriptsTask);

gulp.task('scripts', task.gulpTask());

module.exports = task;
