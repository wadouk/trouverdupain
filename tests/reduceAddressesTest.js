var should = require("should");
global.window = {};
global.document = {};
var merger = require("../public/javascripts/pointMerger.js");

describe("reduce the list of bakeries by merging the differents sources", function () {
    it("if two points too close", function () {

        var t1 = [
            {"coordinates": [2.3441636, 48.861116], "properties": {
                "conge": "1", "fermeture": "Dimanche", "address": "75 Rue Saint-Honoré, 75001 Paris, France"
            }},
            {"coordinates": [2.3441314, 48.8611025], "properties": {
                "name": "Boulanger Pâtissier Julien"}
            }
        ];

        merger.mergeNearPoints(t1).should.eql([
            {"coordinates": [2.3441636, 48.861116], "properties": {
                "conge": "1", "fermeture": "Dimanche", "address": "75 Rue Saint-Honoré, 75001 Paris, France", "name": "Boulanger Pâtissier Julien"
            }}
        ]);
    });

//    it("other two points", function () {
//        var t1 = [
//            {"coordinates": [2.3815154,48.8909446], "properties": {"conge":1}},
//            {"coordinates": [2.381756,48.8909083], "properties": {"name":"hello"}}
//    ];
//
//        merger.mergeNearPoints(t1).should.eql([
//            {"coordinates": [2.3815154,48.8909446], "properties": {
//                "conge":1,"name":"hello"
//            }}
//        ]);
//    });
});


var t2 = [
    {"coordinates": [2.2100338, 48.863289], "properties": {
        "name": "L'aterlier des pains", "osmid": 1404741148
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2125068, 48.8622458], "properties": {
        "addr:street": "Rue du Docteur Marc Bombiger", "name": "La Croisée des Pains",
        "opening_hours": "Tu-Fr 7:00-13:30, 15:30-20:00; Sa 7:00-13:30, 15:30-19:30; Su 7:00-13:00",
        "pastry_shop": "yes", "source": "Survey", "osmid": 2811403887
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2222624, 48.8672593], "properties": {
        "osmid": 2324053185}, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2188005, 48.8797701], "properties": {
        "osmid": 887163325
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2240418, 48.8711425], "properties": {
        "conge": "2", "fermeture": "Dimanche", "address": "1 Avenue Franklin Roosevelt, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2035453, 48.8715142], "properties": {
        "addr:housenumber": "3", "addr:postcode": "92500", "addr:street": "Place du 8 Mai 1945", "name": "Au Bon Pain", "osmid": 858771076
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2042633, 48.8657173], "properties": {
        "osmid": 2282402457}, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2071709, 48.8797395], "properties": {
        "source": "survey 2014", "osmid": 2689331980
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2221391, 48.8801494], "properties": {
        "osmid": 1423517462}, "type": "Feature", "geometry": {"type": "Point"}
    }
];

var t3 = [
    {"coordinates": [2.2102481, 48.8633621], "properties": {
        "conge": "1", "fermeture": "Mardi", "address": "28 Avenue Jean Jaurès, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2219868, 48.86730900000001], "properties": {
        "conge": "2", "fermeture": "Vendredi", "address": "14 Rue Chevreul, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2124969, 48.8623026], "properties": {
        "conge": "2", "fermeture": "Lundi", "address": "36 Rue du Docteur Marc Bombiger, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2120421, 48.8619578], "properties": {
        "conge": "2", "fermeture": "Mercredi", "address": "2 Avenue Jean Jaurès, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2063047, 48.8647388], "properties": {
        "conge": "1", "fermeture": "Lundi", "address": "35 Avenue Jean Jaurès, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2104904, 48.862711], "properties": {
        "conge": "1", "fermeture": "Dimanche", "address": "24 Avenue Jean Jaurès, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2189091, 48.8797521], "properties": {
        "conge": "1", "fermeture": "Mercredi", "address": "228 Rue de Suresnes, 92000 Nanterre, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.223195, 48.8759142], "properties": {
        "conge": "2", "fermeture": "Lundi", "address": "14 Rue de la Liberté, 92150 Suresnes, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2028824, 48.8658392], "properties": {
        "conge": "", "fermeture": "Lundi", "address": "145 Avenue du 18 Juin 1940, 92500 Rueil-Malmaison, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2042511, 48.8656541], "properties": {
        "conge": "", "fermeture": "Dimanche", "address": "87 Rue Gallieni, 92500 Rueil-Malmaison, France"
    }, "type": "Feature", "geometry": {"type": "Point"}},
    {"coordinates": [2.2071352, 48.87981689999999], "properties": {
        "conge": "2", "fermeture": "Mercredi", "address": "202 Rue Paul Vaillant Couturier, 92000 Nanterre, France"
    }, "type": "Feature", "geometry": {"type": "Point"}}
]
