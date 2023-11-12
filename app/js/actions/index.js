import showLoading from './show-loading.js';
import loadTodos from './load-todos.js';
import editTodos from './edit-todos.js';

export const ACTION_SHOW_LOADING = 'show-loading';
export const ACTION_LOAD_TODOS = 'load-todos';
export const ACTION_EDIT_TODOS = 'edit-todos';

export default [
    { name: ACTION_SHOW_LOADING, exec: showLoading },
    { name: ACTION_LOAD_TODOS, exec: loadTodos },
    { name: ACTION_EDIT_TODOS, exec: editTodos }
];