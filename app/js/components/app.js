import { ACTION_LOAD_TODOS, ACTION_SHOW_LOADING } from '../actions/index.js';
import makeTodoService from '../services/todo.js';
import loadingComponent from './loading/loading.js';
import todoListCrudComponent from './todo-list-crud/todo-list-crud.js'
import el from '../utils/create-element.js';

const service = makeTodoService();

export default (state, action) => {

    if (state.loading) {
        return loadingComponent();
    }

    if (!state.todolist) {
        action(ACTION_SHOW_LOADING, {loading: true});
        service.list().then(todolist => {
            action(ACTION_LOAD_TODOS, { todolist });
            action(ACTION_SHOW_LOADING, {loading: false});
        });
        return loadingComponent();
    }

    return el({
        classList: 'todo-app',
        children: [
                
            // App title, menu here if there was one
            el({
                tag: 'h1',
                classList: 'todo-app-title',
                textContent: 'Todo list'
            }),
            
            todoListCrudComponent(state, action)
        ]
    });
};