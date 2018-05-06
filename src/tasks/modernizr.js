const Task = require('../Task');
const MultiTask = require('../MultiTask');
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
const uglifyjs = require('uglify-js');
const modernizr = require("modernizr");
const writefile = require('writefile');
const humanSize = require('human-size');

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
        modernizr.build(config.modernizr, (result) => {
            let dest = path.join(config.destination, '/modernizr.js');

            if (this.isProduction()) {
                let options = {}; // see https://github.com/mishoo/UglifyJS2#minify-options
                result = uglifyjs.minify(result, options).code;
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

module.exports = task;
