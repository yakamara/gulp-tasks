import Task from '../Task';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import notifier from 'node-notifier';

const config = {
    proxy: null,
    port: 3000,
    open: false,
    reloadOnRestart: true,
    notify: false,
    reloadDelay: 0,
    ghostMode: false // disable mirroring clicks, scrolls and forms. it’s too buggy.
};

class BrowserSyncTask extends Task {
    run(done) {
        const bs = browserSync.init(this.config, () => {
            const url = bs.getOption('urls').get('local');

            notifier.notify({
                title: 'ROOOAAAARRRRRR!',
                message: url,
                open: url,
                sound: 'Purr',
                contentImage: __dirname + '/../../assets/yakamara.png'
            });
        });

        done();
    }
}

const task = new BrowserSyncTask('browser-sync', config);

gulp.task(task.gulpTask());

export default task;
