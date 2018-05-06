const Task = require('./Task');
const gulp = require('gulp');

class MultiTask extends Task {
    constructor(name, config, SubTask) {
        super(name, config);

        this.SubTask = SubTask;
        this.subTasks = [];
    }

    create(name, config) {
        const subTask = new this.SubTask(name, Object.assign({}, this.config, config));
        subTask.displayName = this.name + ':' + subTask.displayName;
        this.subTasks.push(subTask);

        return subTask;
    }

    run(done) {
        if (!this.subTasks.length) {
            const gulpTask = new this.SubTask(this.name, this.config).gulpTask();

            return gulpTask(done);
        }

        const tasks = this.subTasks.map((task) => task.gulpTask());

        if (this.isProduction()) {
            gulp.parallel(tasks)(done);
        } else {
            gulp.series(tasks)(done);
        }
    }
}

module.exports = MultiTask;
