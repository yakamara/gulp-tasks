import path from 'path';

/**
 * @param {string} task
 * @returns {Task|MultiTask}
 */
export default (task) => require(path.join(__dirname, 'tasks', task));
