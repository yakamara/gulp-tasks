const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const through = require('through');
const log = require('fancy-log');
const colors = require('ansi-colors');
const imagemin = require('gulp-imagemin');
const count = require('gulp-count');
const path = require('path');

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
                        removeViewBox: false
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

module.exports = task;
