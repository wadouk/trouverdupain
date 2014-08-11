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

    it("deep merge", function () {
        var p0 = {"coordinates":[2.3441636,48.861116],"properties":{"conge":"1","fermeture":"Dimanche","address":"75 Rue Saint-Honoré, 75001 Paris, France"}};
        var p1 = {"coordinates":[2.3441314,48.8611025],"properties":{"name":"Boulanger Pâtissier Julien"}};

        merge.deepMerge(p0,p1).should.eql({"coordinates":[2.3441636,48.861116],"properties":{
            "conge":"1","fermeture":"Dimanche","address":"75 Rue Saint-Honoré, 75001 Paris, France","name":"Boulanger Pâtissier Julien"
        }});
    })
});
