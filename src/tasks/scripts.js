import Task from '../Task';
import MultiTask from '../MultiTask';
import gulp from 'gulp';
import through from 'through';
import log from 'fancy-log';
import colors from 'ansi-colors';
import browserify from 'browserify';
import watchify from 'watchify';
import 'babelify';
import uglify from 'gulp-uglify-es';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import size from 'gulp-size';
import notifier from 'node-notifier';
import path from 'path';

const config = {
    source: null,
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
            presets: [
                ["@babel/preset-env", {
                    useBuiltIns: "entry",
                    corejs: 3,
                }]
            ]
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
            .pipe(this.isProduction() ? (uglify.default)() : through())
            .pipe(size({title: colors.white('Generated Script:'), showFiles: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(this.config.destination))
            .pipe(browserSync.stream());

        b.on('update', bundle);

        return bundle();
    }
}

const task = new MultiTask('scripts', config, ScriptsTask);

gulp.task(task.gulpTask());

export default task;
