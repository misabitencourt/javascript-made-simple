

export default (state, params) => {
    return {
        ...state,
        todolist: params.todolist,
        todoListFormOnEdition: null
    }
}