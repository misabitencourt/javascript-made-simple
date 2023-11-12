import { ACTION_EDIT_TODOS, ACTION_LOAD_TODOS } from '../../actions/index.js';
import makeTodoService from '../../services/todo.js';
import el from '../../utils/create-element.js';

const service = makeTodoService();

export default (state, action) => el({
    classList: 'todo-list-app-todo-list-crud-list',
    children: (() => {
        if (!state.todolist) {
            return [];
        }

        if (!state.todolist.length) {
            return [
                el({
                    tag: 'p',
                    classList: 'alert-default',
                    textContent: 'No items have been created yet.'
                })
            ];
        }

        return [
            el({
                tag: 'ul',
                classList: 'todo-list-app-todo-list-crud-list-ul',
                children: state.todolist.map(listitem => {
                    return el({
                        tag: 'li',
                        classList: 'todo-list-app-todo-list-crud-list-ul-li',
                        children: [

                            // List item title
                            el({
                                tag: 'span',
                                classList: 'todo-list-app-todo-list-crud-list-ul-li-title',
                                textContent: listitem.text,
                            }),

                            // List item edit icon
                            el({
                                tag: 'a',
                                attributes: [{name: 'href', value: 'javascript:;'}],
                                classList: 'todo-list-app-todo-list-crud-list-ul-li-action',
                                textContent: '✏️',
                                events: [
                                    {
                                        event: 'click',
                                        listener: () => {
                                            action(ACTION_EDIT_TODOS, {onEdition: {...listitem}});
                                        }
                                    }
                                ]
                            }),

                            el({
                                tag: 'a',
                                attributes: [{name: 'href', value: 'javascript:;'}],
                                classList: 'todo-list-app-todo-list-crud-list-ul-li-action',
                                textContent: '❌',
                                events: [
                                    {
                                        event: 'click',
                                        listener: () => {
                                            const errorLog = err => console.error(err);
                                            action(ACTION_LOAD_TODOS, {loading: true});
                                            service.destroy(listitem).then(() => {
                                                service.list(listitem).then(todolist => {
                                                    action(ACTION_LOAD_TODOS, {loading: false});
                                                    action(ACTION_LOAD_TODOS, {todolist});
                                                }).catch(errorLog);
                                            }).catch(errorLog);
                                        }
                                    }
                                ]
                            }),
                        ]
                    });
                })
            })
        ];
    })()
})