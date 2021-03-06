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
    this.db.collection('geoboulang_osm', callback);
};


controller.prototype.near = function (lat, lng, callback) {
    this.getCollection(function (error, collection) {
        function extracted(error, data) {
            return callback(null, {center: {lat: parseFloat(lat), lng: parseFloat(lng)}, markers: data});
        }

        if (error) (callback(error));
        else {
            collection.find({"coordinates": {$near: [parseFloat(lng), parseFloat(lat)]}}, {type: false, _id: false, "properties.bie": false, "properties.tel": false}, {limit: 20}).toArray(extracted);
        }
    });
};

controller.prototype.geocode = function (addr, callback) {
    var me = this;
    if (!addr) {
        callback('EMPTY');
    } else {
        geocoder.geocode(addr, function (err, data) {
            if (data.status && data.status == 'OK') {
                var location = data.results[0].geometry.location;
                me.near(location.lat, location.lng, callback);
            } else {
                callback('NO_ADDR');
            }
        })
    }

};

exports.controller = controller;
