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


controller.prototype.near = function (callback) {
    this.getCollection(function (error, collection) {
        if (error) (callback(error));
        else collection.find({"coordinates": {$near: [2.39552, 48.84043]}}).toArray(function (err, results) {
            console.log(results);
            callback(err, results);
        });
    });
};

exports.controller = controller;