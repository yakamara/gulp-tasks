const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const del = require('del');

const config = {
    paths: null,
};

class CleanTask extends Task {
    run(done) {
        del(this.config.paths).then((paths) => {
            if (paths.length > 0) {
                log(colors.white('Cleaned files: ' + colors.magenta(paths.length)));
            }

            done();
        });
    }
};

const task = new MultiTask('clean', config, CleanTask);

gulp.task(task.gulpTask());

module.exports = task;
