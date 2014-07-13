var merge = require('./merge');

function closingDay(fermeture) {
    return [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
    ].indexOf(fermeture);
}

function isClose(properties,_options) {
    _options = merge({day:new Date().getDay(),month:new Date().getMonth()},_options);
    var closedDay = closingDay(properties.fermeture);
    var closedMonth = closingMonth(properties.conge, _options);
    return closedDay === _options.day || closedMonth === _options.month;
}


function closingMonth(num,_options) {
    _options = merge({year:new Date().getFullYear()},_options);
    //2007 Juillet Aout
    //1      x
    //2             x
    var fullYear = _options.year;
    var oddYearsFrom2007 = (fullYear - 2007) % 2 == 0;
    return (num == 2 && oddYearsFrom2007) || (num == 1 && !oddYearsFrom2007) ? 7 : 6;
}

function conge(num) {
    //2007 Juillet Aout
    //1      x
    //2             x
    return (closingMonth(num) === 7 ? "en Aout" : "en Juillet") + " (Groupe " + num + ")";
}

module.exports = {
    isClose : isClose,
    conge : conge
};
