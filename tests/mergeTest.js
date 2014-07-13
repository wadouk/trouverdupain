var merge = require("../public/javascripts/merge"),
    should = require("should");

describe('Merge', function() {
    it("le merge rajouter les props si elles n'existent pas", function () {
        merge({},{a:2}).should.containDeep({a:2})
    });
    it("le merge ne modifie pas les valeurs existantes", function () {
        merge({a:3},{a:2}).should.containDeep({a:2})
    });
    it("le merge sans argument retourne l'objet sans planter", function () {
        merge({b:3}).should.containDeep({b:3})
    });

});
