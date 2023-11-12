import el from '../../utils/create-element.js';



export default () => el({
    classList: 'todo-app-loading-modal',
    children: [
        el({
            tag: 'p',
            textContent: 'Loading...'
        })
    ]
});