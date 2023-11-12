

const ONE_MINUTE_IN_MILISECS = 6e4;

module.exports = { 
    ONE_MINUTE_IN_MILISECS,

    wait: milisecs => new Promise(resolve => setTimeout(resolve, milisecs))
};