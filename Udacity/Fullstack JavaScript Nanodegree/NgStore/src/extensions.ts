Number.prototype.round = function(places: number): number {
    return +(Math.round(+(this + "e+" + places))  + "e-" + places);
};
