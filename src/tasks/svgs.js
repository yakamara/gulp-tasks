const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const colors = require('ansi-colors');
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

            // assemble one SVG
            .pipe(svgstore({
                inlineSvg: true
            }))

            .pipe(svgmin({
                plugins: [{
                    cleanupIDs: false,
                    removeUselessDefs: false,
                    addClassesToSVGElement: {
                        classNames: ['jabbathehutt'] // a huuuuuuge svg containing it all
                    }
                }]
            }))

            // stop error prevention
            .pipe(plumber.stop())

            .pipe(size({'title': 'SVGs'}))
            .pipe(count(colors.white('Processed svgs: <%= counter %>')))

            .pipe(gulp.dest(this.config.destination));
    }
}

const task = new MultiTask('svgs', config, SvgsTask);

gulp.task(task.gulpTask());

module.exports = task;
