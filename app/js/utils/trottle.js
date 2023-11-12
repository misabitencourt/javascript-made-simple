
const fnMap = new Map();

export default (fn, timeout= 680) => {
    const existingTimeout = fnMap.get(fn);
    if (existingTimeout) {
        clearTimeout(existingTimeout);
    }
    let fnTimeout = setTimeout(() => fn(), timeout);
    fnMap.set(fn, fnTimeout);
}