var should = require("should"),
    conges = require("../public/javascripts/conges");

describe('Conge', function(){
    it('Fermeture Jeudi, groupe 1, congés en juillet 2007, un jeudi de juillet 2007', function(){
        conges.isClose({fermeture:"Jeudi",conge:"1"},{day:5,month:6,year:2007}).should.be.true;
    });
    it('Fermeture mercredi, groupe 2, congés en aout 2007, un jeudi de juillet 2007', function(){
        conges.isClose({fermeture:"Mercredi",conge:"2"},{day:5,month:6,year:2007}).should.be.false;
    });
    it('Fermeture Jeudi, groupe 1, congés en juillet 2007, un jeudi de juillet 2014', function(){
        conges.isClose({fermeture:"Jeudi",conge:"1"},{day:5,month:6,year:2014}).should.be.false;
    });
    it('Fermeture mercredi, groupe 2, congés en aout 2007, un jeudi de juillet 2014', function(){
        conges.isClose({fermeture:"Mercredi",conge:"2"},{day:5,month:6,year:2014}).should.be.true;
    });
});
