import makeTodoRepo from '../repos/todo.js';
import validate, { VALIDATION_REQUIRED } from '../utils/validations.js';

/**
 * Todo business rules
 * 
 * @returns TodoService
 */
const makeTodoService = () => {
    const repo = makeTodoRepo();

    return {

        validate(entity) {
            [
                {fieldName: 'text', validation: VALIDATION_REQUIRED},
                // more here
            ].forEach(field => {
                if (!validate(entity[field.fieldName], field.validation)) {
                    throw {type: 'validation', field};
                }
            });
        },

        async list() {
            return (await repo.list());
        },

        async findById(id) {
            return (await repo.findById(id));
        },

        async search(term) {
            return (await repo.search(term));
        },

        async create(todo) {
            this.validate(todo);

            return (await repo.create(todo));
        },

        async update(todo) {
            this.validate(todo);
            if (!todo.id) {
                throw {type: 'validation', field: {fieldName: 'id', validation: VALIDATION_REQUIRED}};
            }

            return (await repo.update(todo));
        },

        async destroy(todo) {
            return (await repo.destroy(todo));
        }

    };
};

export default makeTodoService;