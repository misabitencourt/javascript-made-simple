import el from '../../utils/create-element.js';
import todoListCrudList from './todo-list-crud-list.js';
import dodoListCrudForm from './todo-list-crud-form.js';



export default (state, action) => el({
    classList: 'todo-list-app-todo-list-crud',
    children: [

        dodoListCrudForm(state, action),
        
        todoListCrudList(state, action)

    ]
})