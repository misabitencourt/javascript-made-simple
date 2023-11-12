
# Javascript Made Simple!

-- Introdutory --

Not ever frontend projects needs to use a set of complex tools to build or run. Almost all of the new Javascript projects contains a Framework with this tools, 
transpilers, transformers, minifiers, css libs and dependencies for every feature. But you dont necessarily need to follow this way to build your application, specially if your project is a small one. 

This further article shows some approaches to create a application without that bunch of complex tools. A P.O.C. was created in order to demostrate is. It is about one simple crud created with modern Javascript with no dependencies.

It was wrote using the functional paradigm because Javascript is more Haskell than Java!

About the css, no one lib or framework was used, just a css reset followed by the app style.

## Creating a simple CRUD

In order to sample how to use the language in a simple way, using the "Vanilla Javascript", a Create Retrieve Update Delete user interface have been created and the following text explains a several ways to realise it. 

An exemple of a simple CRUD APP in raw Javascript could be found in this repository:

-- REPO LINK HERE --

### Importing the main.js script

Using a HTML5 document, is possible to add a "script" tag with "module" as "type" property.  This tag will import a [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) on your web application that could also import another modules.

index.html
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Javascript made simple!</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/todolist.css">
</head>
<body>
    
    <div class="app"></div>
    
    <script type="module" src="js/main.js"></script>

</body>
</html>
```

js/main.js
```javascript
import actions from './actions/index.js';
import todoAppComponent from './components/app.js';


window.todoApp = function(renderInEl) {
/// ... more code
```

Note: The ```div``` with the ```app``` class is out target element to render the entire application.

### The View -  Manipulation Elements with just Javascript

The Javascript runtime available on the current major browsers is powerfull. One of its power is the [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element) manipulation. Despite that, the "raw javascript" element API could be simplifyed by our home made functions. For example, if you must create a title for one application section using the built in api, it would be like:

```javascript
const title = document.createElement('h1'); // Creates element
title.textContent = 'User list'; // Sets the text content of it
parentElement.appendChild(title); // Appends the title element as a parentElement child (it must be another element, like document.body or another) 
```

At the first look, it sounds nice and easy, but if you would have a little bit more complex element tree, it would be a pain:

```javascript
// Creates the four elements
const title = document.createElement('h1');
const titleIcon = document.createElement('img');
const titlePrimaryText = document.createElement('span');
const titleSecondaryText = document.createElement('small');

// Adds CSS classes to them
title.classList.add('app-main-title');
titleIcon.classList.add('app-main-title-icon');
titlePrimaryText.classList.add('app-main-title-primary-text');
titleSecondaryText.classList.add('app-main-title-secondary-text');

// Adds text Content and src to them
titlePrimaryText.textContent = 'User list';
titleSecondaryText.textContent = 'Listing X users from Y';
titleIcon.src = 'assets/img/users-icon.svg';

// Appends the title children
title.appendChild(titleIcon);
title.appendChild(titlePrimaryText);
title.appendChild(titleSecondaryText);

// Appends the title with children to one parent element
parentElement.appendChild(title);
```

In order to create a DOM tree in a most efficient way, i reccommend the approach used by some microframeworks like: [Mithril](https://mithril.js.org/), [Hyperapp](https://github.com/jorgebucaran/hyperapp) or [React](https://react.dev/) without JSX.

It could solved by create a function with receives, at least, thease parameters: 

 - String: the tag name 
 - String: css class list
 - Element[]: the list of children elements or the text content

The implementation of that is like that:

```javascript
export default function el({
    tag,
    textContent,
    classList,
    children,
    events,
    attributes
}) {
    
    const element = document.createElement(tag || 'div');

    if (textContent) {
        element.textContent = textContent;
    }

    if (classList) {
        (classList+'').split(' ').filter(clazz => clazz.trim()).forEach(clazz => element.classList.add(clazz));
    }

    if (children) {
        children.forEach(child => element.appendChild(child));
    }

    if (events) {
        events.forEach(event => {
            element.addEventListener(event.event, event.listener);
        });
    }

    if (attributes) {
        attributes.forEach(attribute => {
            element.setAttribute(attribute.name, attribute.value);
        });
    }

    return element;
}
```

This function is used in this way:

```javascript

// Creates the element tree mentioned above using our helper
const title = el({
    tag: 'h1',
    classList: 'app-main-title',
    children: [
        el({ 
            tag: 'img',
            classList: 'app-main-title-icon',
            attributes: {src: 'assets/img/users-icon.svg'}
        }),
        el({
            tag: 'span',
            classList: 'app-main-title-primary-text', // OR a string constant from another module
            textContent: 'User list' // or getTranslatedText() from another module
        }),
        el({
            tag: 'span',
            classList: 'app-main-title-secondary-text', // OR a string constant from another module
            textContent: 'Listing X users from Y' // or getListCount() from another module
        })
    ]
});

// Appending the created element tree to another element
parentElement.appendChild(title);
```

We could got a lot of advantages using this kind of functional module to create views. Imagine if you must code a user list of that screeen, you would have got a shortcut in your hands. Take a look:

```javascript

// Supposing it is in an async function
const users = await userService.list();

const userList = el({
    tag: 'ul',
    classList: 'app-user-list',

    children: users.map(user => ( // Transforms user json to user list item element
        el({
            tag: 'li',
            classList: 'app-user-list-item',
            children: [
                // User name on list
                el({ tag: 'span', textContent: user.name }),

                // ... icons and stuff
            ]
        })
    ))
});
```

If you choose to use it, you would probably have to create a application state manager. It doesnt needs to be something complicated like [Redux](https://redux.js.org/). 

I suggest to use an object json witch represents the application state and can't be changed by component functions, just read by them. Once the component needs to trigger some event, it could do it using some callback function in order to sepparate the render function and the state change logic. That state change functions could be tested on unity.

The code above is about the root render of a component tree:

```javascript
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
```

A simple component would be like:

```javascript
export default (state, action) => el({
    classList: 'todo-list-app-todo-list-crud-list',
    children: (() => {
        if (!(state.todolist && state.todolist.length)) {
            return [
                el({
                    tag: 'p',
                    classList: 'alert-default',
                    textContent: 'No items have been created yet.'
                }),
                button({
                    text: 'Reload',
                    onClick: () => action(TODO_LIST_RELOAD_ACTION, null)
                })
            ];
        }

        return state.todolist.map(todo => 
            el('div', 'todo-list-app-todo-list-crud-list-item', { textContent: todo.text }));
    })()
});
```

This suggestion is a reactive functional approach. Some procedural or object oriented one also could be done with raw javascript if you are not confortable with functional programming.

### Using modules - decoupling code with javascript modules

ES2016 Javascript modules naturally acts like a [Singleton object](https://refactoring.guru/pt-br/design-patterns/singleton). The script inside a module have it own scope. Unlike the classic javascript code imported with "script src=", when you declare a variable in some module, that variable does not populate the global scope. The programmer can control what variables can be accessible from other modules using the "export" sintax. For example:

some-module.js
```javascript

// This variable is only accessible from THIS module
const petSizes = {
    small: 1,
    medium: 2,
    large: 3
};

function checkPetSize(size) {
    switch (size) {
        case (petSizes.small):
            return 'small';
        case (petSizes.medium):
            return 'medium';
        case (petSizes.large):
            return 'LARGE';
        default:
            return 'unknown';
    }
}

// This function is available for another modules
export checkPetSize;
```

By using javascript modules to your advantage, you can naturally create singleton services or some [object factories](https://refactoring.guru/pt-br/design-patterns/factory-method). Using the javascript "ducktype" to your advantage, the dependency injection also could be done easily. 

### Fetch HTTP Client

The majority of modern apps must send and retrieve data from backend webservices. It is usually being done with HTTP protocol. Nowdays, there is no need of any lib like [JQuery.ajax](https://api.jquery.com/jQuery.ajax/) or [axios](https://axios-http.com/docs/intro) to perform that kind of request.

The modern browsers supports [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) by default. This api uses javascript Promises and it is easy to use. See the following sample:

```javascript

async function getConfigJson() {
    const response = await fetch(`https://my-api.com/v1/config/`);
    if (response.code !== 200) {
        throw new Error(`Error no fetch config`);
    }
    const configJson = await res.json();

    return configJson;
}

```

I recommend the wrapping of the fetch api in specific module to perform a http fetch. By this way, some request configurations like the API path and the authorization request headers would be easily managed.

### Native Local Databases

The HTML, CSS and JS trio is used not only to create web apps but mobile and desktop too (see [Electron](https://www.electronjs.org/) and [Tauri](https://tauri.app/)). All of the software on this platforms needs a local database in a higher or lower level. All online websites sometimes needs to store some cache and configuration in a local machine.

In all of this platforms, the JS code could be exactly the same on doing database operations. We have two secure ways to do it: [Localstorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage) and [IndexedDb](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). This first option is the faster way to save and retrieve data. Check this out:

```javascript
localStorage.setItem('data-key', 'data-value');
```

This API have been available in all major browsers for years but Localstorage have some issues. It is not available in all javascript backend runtimes and it stores only strings. Thease strings are normally one stringified JSON stored like:


```javascript
// save
localStorage.setItem('app-config', JSON.stringify(config));

// load
const config = JSON.parse(localStorage.getItem('app-config'));
```

The LocalStorage also have data size limitations and it is different between browsers and runtimes. More than 1 Megabyte datastorage is dangerous to using. For large amount of data, is recommended IndexedDb instead.

### Code checking and tests

With all of that APIs you have seen before, you are able to create and entire application with Javascript without no extra transformer, library or framework. You may consider it optional for smaller projects but some code audition tools are recommended. The standart tools for syntax and style checking are: [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/docs/latest/use/getting-started).

End to end tests (also known as e2e or integration test) are almost excetial for frontend apps. To perform it, [Playwright](https://playwright.dev/) is a good fit for. The original raw javascript code whould not changed or transformed to create it. This lib works just as a bot navigatinig, clicking, typing and checking the app in a browser of your prefference.  

## A good option

As you have seen, it is absolutely possible to create a Javascript application without a bunch of complex polifylls, JSX, transpilers, libs and etc. The first detail you plan about you project do not needs to be a framework choose, why not to give a change to the language default resources? 

If it is about a huge and complex project with dozens of coders from different ecosystems working on it, the dependency avoiding could be on your way. But if you have some mid-sized project or an ordinary one, you may claim yourself for simplicity.  

