function Nomination(title) {
    this.title = title;
}

var nominations = [];

var addNomination = function(title) {
    nominations.push(new Nomination(title));
};

var getNominations = function() {
    return nominations;
}

var clearNominations = function() {
    nominations = [];
}

module.exports = {
    addNomination: addNomination,
    getNominations: getNominations,
    clearNominations: clearNominations
};
