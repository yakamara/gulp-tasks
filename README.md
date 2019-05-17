Yakamara Gulp Tasks
===================

Installation
------------

### npm

```
npm install @yakamara/gulp-tasks --save-dev
```

### yarn

```
yarn add @yakamara/gulp-tasks --dev
```

Usage
-----

### Example `gulpfile.js/index.js`

```js
const gulp = require('gulp');
const init = require('@yakamara/gulp-tasks').require('init');

require('dotenv').config({
    path: '.env.local'
});

require('./config');

const tasks = {
    build: gulp.series(
        init.gulpTask({
            production: 'prod' === process.env.APP_ENV,
            watching: false,
        }),
        'clean',
        gulp.parallel(
            'styles',
            'scripts',
            'modernizr',
            'images',
            'copy',
        )
    ),

    watch: gulp.series(
        init.gulpTask({
            production: 'prod' === process.env.APP_ENV,
            watching: true,
        }),
        'clean',
        'styles',
        'scripts',
        'modernizr',
        'images',
        'copy',
        'browser-sync',
    ),
};

gulp.task('build', tasks.build);
gulp.task('watch', tasks.watch);
gulp.task('default', 'prod' === process.env.APP_ENV ? tasks.build : tasks.watch);
```

### Example `gulpfile.js/config.js`

```js
const tasks = require('@yakamara/gulp-tasks');

tasks.require('browserSync').configure({
    proxy: process.env.APP_HOST,
});

tasks.require('clean').configure({
    paths: './public/assets/{fonts,images,styles,scripts,svgs}/**/*',
});

tasks.require('styles').configure({
    source: './assets/styles/*.scss',
    destination: './public/assets/styles',
    // sassVariables: {},
    // cssnano: {},
});

tasks.require('scripts').configure({
    source: './assets/scripts/script.js',
    destination: './public/assets/scripts',
});

tasks.require('modernizr').configure({
    destination: './public/assets/scripts',
    // modernizr: {}
});

const copy = tasks.require('copy');
copy.create('fonts', {
    source: './assets/fonts',
    files: '**/*.{woff,woff2}',
    destination: './public/assets/fonts'
});
copy.create('FontAwesome', {
    source: './node_modules/font-awesome/fonts',
    files: '*.{woff,woff2}',
    destination: './public/assets/fonts'
});

tasks.require('images').configure({
    source: './assets/images',
    destination: './public/assets/images'
});

```
