function ContextSupplier(key, supply) {
    this.key = key;
    this.supply = supply;
}

ContextSupplier.prototype.canSupply = function(key) {
    return this.key === key;
}

module.exports = ContextSupplier;
