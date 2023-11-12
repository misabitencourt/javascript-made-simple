


export default (state, params) => {
    return {
        ...state,
        todoListFormOnEdition: params.onEdition
    }
};