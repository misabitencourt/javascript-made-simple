

export default (state, params) => {
    return {
        ...state,
        loading: params.loading
    };
}