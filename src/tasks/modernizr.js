import Task from '../Task';
import MultiTask from '../MultiTask';
import gulp from 'gulp';
import log from 'fancy-log';
import colors from 'ansi-colors';
import path from 'path';
import terser from 'terser';
import modernizr from 'modernizr';
import writefile from 'writefile';
import humanSize from 'human-size';

const config = {
    destination: null,

    // https://modernizr.com/docs
    modernizr: {
        'feature-detects': [
            'touchevents'
        ],
        'options': [
            'setClasses',
            "addTest"
        ],
        'classPrefix': ''
    },
};

class ModernizrTask extends Task {
    run(done) {
        modernizr.build(config.modernizr, async (result) => {
            let dest = path.join(config.destination, '/modernizr.js');

            if (this.isProduction()) {
                let options = {}; // see https://github.com/mishoo/UglifyJS2#minify-options
                result = (await terser.minify(result, options)).code;
            }

            let targetSize = humanSize(Buffer.byteLength(result, 'utf8'));

            writefile(dest, result, () => {
                log(colors.white('Built custom modernizr: ' + colors.magenta(targetSize)));

                return done();
            });
        });
    }
}

const task = new MultiTask('modernizr', config, ModernizrTask);

gulp.task(task.gulpTask());

export default task;
