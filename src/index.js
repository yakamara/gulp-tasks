const path = require('path');

/**
 * @param {string} task
 * @returns {Task|MultiTask}
 */
exports.require = (task) => require(path.join(__dirname, 'tasks', task));
