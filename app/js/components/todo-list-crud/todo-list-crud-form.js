import el from '../../utils/create-element.js';
import buttonComponent from '../buttons/common.js';
import getFormData from '../../utils/get-form-data.js';
import { ACTION_EDIT_TODOS, ACTION_LOAD_TODOS, ACTION_SHOW_LOADING } from '../../actions/index.js';
import makeTodoService from '../../services/todo.js';

const service = makeTodoService();

export default (state, action) => el({
    tag: 'form',
    classList: 'todo-list-app-todo-list-crud-form',
    events: [
        {event: 'submit', listener: event => {
            console.log(event.target, event.target.parentElement);
            event.target.disabled = true;
            event.preventDefault();
            event.stopPropagation
            const savedData = getFormData(event.target);
            console.log(savedData);
            action(ACTION_SHOW_LOADING, {loading: true});

            let saveMethod = 'create';
            if (state.todoListFormOnEdition) {
                saveMethod = 'update';
                savedData.id = state.todoListFormOnEdition.id;
            }

            service[saveMethod](savedData).then(() => {
                service.list().then(todolist => {
                    action(ACTION_LOAD_TODOS, {todolist});
                    action(ACTION_SHOW_LOADING, {loading: false});
                    action(ACTION_EDIT_TODOS, {onEdition: null});
                }).catch(err => {
                    console.error(err);
                });
            }).catch(err => {
                console.error(err);
            });
        }},

        {event: 'reset', listener: () => {
            action(ACTION_EDIT_TODOS, {onEdition: null});
        }}
    ],
    children: [
        el({
            tag: 'input',
            classList: 'form-input',
            attributes: [
                {name: 'value', value: state.todoListFormOnEdition ? state.todoListFormOnEdition.text : ''},
                {name: 'placeholder', value: 'New Todo'},
                {name: 'required', value: true},
                {name: 'maxlength', value: 255},
                {name: 'name', value: 'text'}
            ]
        }),
        
        buttonComponent({
            textContent: 'Save',
            attributes: [
                {name: 'type', value: 'submit'},
                {name: 'data-type', value: 'edit'}
            ]
        }),

        buttonComponent({
            textContent: 'Cancel',
            classList: 'button-secondary',
            attributes: [
                {name: 'type', value: 'reset'},
                {name: 'data-type', value: 'edit'}
            ]
        })
    ]
})