import Task from '../Task';
import MultiTask from '../MultiTask';
import gulp from 'gulp';
import log from 'fancy-log';
import colors from 'ansi-colors';
import copy from 'cpy';
import path from 'path';

const config = {
    source: null,
    files: '*',
    destination: null,
};

class CopyTask extends Task {
    run() {
        return copy(this.config.files, path.resolve(this.config.destination), {
            cwd: this.config.source,
            parents: true,
            nodir: true
        }).then((res) => {
            if (res.length > 0) {
                log(colors.white('Copied \'' + colors.cyan(this.name) + '\': ' + colors.magenta(res.length)));
            }
        });
    }

    defaultWatch() {
        this.watch(this.config.files, {cwd: this.config.source});
    }
}

const task = new MultiTask('copy', config, CopyTask);

gulp.task(task.gulpTask());

export default task;
