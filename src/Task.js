const gulp = require('gulp');

class Task {
    constructor(name, config = {}) {
        this.name = name;
        this.displayName = name;
        this.config = config;
        this.watching = null;
    }

    configure(config) {
        Object.assign(this.config, config);

        return this;
    }

    watch(glob, options = {}) {
        if (glob) {
            this.watching = {glob, options};
        } else {
            this.watching = glob;
        }

        return this;
    }

    gulpTask() {
        const task = (done) => {
            if (this.isWatchingEnabled()) {
                if (null === this.watching) {
                    this.defaultWatch();
                }
                if (this.watching) {
                    gulp.watch(this.watching.glob, this.watching.options, this.gulpTask());
                    this.watching = false;
                }
            }

            return this.run(done);
        };
        task.displayName = this.displayName;

        return task;
    }

    defaultWatch() {}

    isProduction() {
        return Task.globalConfig.production;
    }

    isWatchingEnabled() {
        return Task.globalConfig.watching;
    }
}

Task.globalConfig = {
    production: false,
    watching: false,
}

module.exports = Task;
