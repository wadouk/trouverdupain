var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;

var controller = function () {
    this.server = new Server('localhost', 27017, {auto_reconnect: true});
    this.db = new Db('trouverdupain', this.server);
};

controller.prototype.getCollection = function (callback) {
    this.db.collection('geoboulang', callback);
};


controller.prototype.near = function (lat, lng, callback) {
    this.getCollection(function (error, collection) {
        if (error) (callback(error));
        else {
            collection.find({"coordinates": {$near: [parseFloat(lng), parseFloat(lat)]}}, {type: false, _id: false, "properties.bie": false, "properties.tel": false}, {limit: 20}).toArray(callback);
        }
    });
};

exports.controller = controller;