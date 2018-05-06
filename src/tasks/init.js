const Task = require('../Task');
const gulp = require('gulp');
const colors = require('ansi-colors');

class InitTask extends Task {
    run(done) {
        if (this.isProduction()) {

            console.log(colors.cyan('\n  Production\n'));
        }
        else {

            console.log(colors.cyan('\n  Development\n'));
        }

        done();
    }

    gulpTask(globalConfig = {}) {
        const baseTask = super.gulpTask();

        const task = (done) => {
            Object.assign(Task.globalConfig, globalConfig);

            return baseTask(done);
        };

        task.displayName = baseTask.displayName;

        return task;
    }
}

const task = new InitTask('init');

gulp.task(task.gulpTask());

module.exports = task;
