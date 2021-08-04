const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const colors = require('ansi-colors');
const log = require('fancy-log');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const count = require('gulp-count');

const config = {
    source: null,
    destination: null,
};

class SvgsTask extends Task {
    run() {
        return gulp.src(this.config.source)

            // prevent pipe breaking caused by errors
            .pipe(plumber())

            // minify
            .pipe(svgmin({
                plugins: [{
                    name: 'removeTitle',
                    active: true
                }, {
                    name: 'removeViewBox',
                    active: false
                }]
            }))

            // log
            .pipe(count({
                message: colors.white('SVG files processed: <%= counter %>'),
                logger: (message) => log(message)
            }))

            // assemble one SVG
            .pipe(svgstore({
                inlineSvg: true
            }))

            // stop error prevention
            .pipe(plumber.stop())

            .pipe(size({'title': 'SVGs'}))

            .pipe(gulp.dest(this.config.destination));
    }
}

const task = new MultiTask('svgs', config, SvgsTask);

gulp.task(task.gulpTask());

module.exports = task;
