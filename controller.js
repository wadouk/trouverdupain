var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    geocoder = require('geocoder');
;

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

controller.prototype.geocode = function (addr, callback) {
    var me = this;
    geocoder.geocode(addr, function (err, data) {
        if (data.status == 'OK') {
            var location = data.results[0].geometry.location;
            me.near(location.lat, location.lng, callback);
        } else {
            callback('NO_ADDR');
        }
    })
};

exports.controller = controller;