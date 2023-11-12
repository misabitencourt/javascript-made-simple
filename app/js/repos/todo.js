
const todoKey = 'TODO';

/**
 * This repository could be easily refactored to do API calls instead of
 * Local database storage.
 * 
 * @returns Todo local repository
 */
const makeTodoRepo = () => {

    function getNewId() {
        const pkKey = `${todoKey}__PK`;
        const lastOne = localStorage.getItem(pkKey) || '0';
        const currentOne = +lastOne + 1;
        localStorage.setItem(pkKey, currentOne);

        return currentOne;
    }

    function persist(list) {
        localStorage.setItem(todoKey, JSON.stringify(list));
    }

    return {
        
        async list() {
            const strList = localStorage.getItem(todoKey) || '[]';
            return JSON.parse(strList);
        },

        async findById(id) {
            const list = await this.list();
            return list.find(todo => todo.id === id);
        },

        async search(term) {
            const list = await this.list();
            const termToLowerCase = term.toLowerCase();

            return list.filter(todo => todo.text.toLowerCase().indexOf(termToLowerCase) !== -1);
        },

        async create(todo) {
            const list = await this.list();
            todo.id = getNewId();
            list.push(todo);
            persist(list);
            
            return todo;
        },

        async update(todo) {
            const list = await this.list();
            const currentSaved = list.find(todoSaved => todoSaved.id === todo.id);
            currentSaved.text = todo.text;
            persist(list);
        },

        async destroy(todo) {
            const list = await this.list();
            const currentSaved = list.find(todoSaved => todoSaved.id === todo.id);
            list.splice(list.indexOf(currentSaved), 1);
            persist(list);
        }

    };
};

export default makeTodoRepo;
