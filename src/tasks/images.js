import Task from '../Task';
import MultiTask from '../MultiTask';
import gulp from 'gulp';
import through from 'through';
import log from 'fancy-log';
import colors from 'ansi-colors';
import imagemin from 'gulp-imagemin';
import count from 'gulp-count';
import path from 'path';

const config = {
    source: null,
    files: '**/*.{jpg,png,gif,svg,ico}',
    destination: null,
};

class ImagesTask extends Task {
    run() {
        return gulp.src(path.join(this.config.source, this.config.files))

            .pipe(this.isProduction() ? imagemin([
                // https://www.npmjs.com/browse/keyword/imageminplugin
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({progressive: true}),
                imagemin.optipng({optimizationLevel: 2}),
                imagemin.svgo({
                    plugins: [{
                        removeTitle: false
                    }, {
                        removeViewBox: false
                    }, {
                        cleanupIDs: {
                            prefix: {
                                toString() {
                                    this.counter = this.counter || 0;
                                    return `id-${this.counter++}`;
                                }
                            }
                        }
                    }]
                })
            ], {
                verbose: true
            }) : through())

            .pipe(count({
                message: colors.white('Processed images \'' + colors.cyan(this.name) + '\': <%= counter %>'),
                logger: (message) => log(message)
            }))

            .pipe(gulp.dest(this.config.destination));
    }

    defaultWatch() {
        this.watch(this.config.files, {cwd: this.config.source});
    }
}

const task = new MultiTask('images', config, ImagesTask);

gulp.task(task.gulpTask());

export default task;
