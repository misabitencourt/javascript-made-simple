import actions from './actions/index.js';
import todoAppComponent from './components/app.js';


const todoApp = function(renderInEl) {

    /**
     * 
     * See ./docs/app-diagram.png for better comprehension
     * 
     */
    let state = {};
    let renderedElement;

    /**
     * App state changed! action trigger!
     * @param {*} actionName Id of the action triggered
     * @param {*} params action parameters
     */
    function actionTrigger(actionName, params) {
        const action = actions.find(action => action.name === actionName);
        if (!action) {
            console.warn(`Action ${actionName} not found`);
            return state;
        }
        state = action.exec(state, params);
    }

    /**
     * Single app render, on action trigger or app start
     */
    function render() {
        console.log('render called', state);
        const currentRender = todoAppComponent(state, (action, params) => {
            actionTrigger(action, params);
            render();
        });
        if (renderedElement) {
            renderedElement.parentElement.removeChild(renderedElement);
        }
        renderedElement = currentRender;
        renderInEl.appendChild(renderedElement);
    }

    // First render
    render();
};


// get the element when the frontend will be render and do it
todoApp(document.querySelector('.app'));