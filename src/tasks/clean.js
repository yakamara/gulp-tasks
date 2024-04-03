import Task from '../Task';
import MultiTask from '../MultiTask';
import gulp from 'gulp';
import log from 'fancy-log';
import colors from 'ansi-colors';
import del from 'del';

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

export default task;
