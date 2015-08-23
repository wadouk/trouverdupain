/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , browserify = require('browserify')
    , Controller = require('./controller').controller;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

var b = browserify();
b.add('./public/vendor/easy-button.js');
b.add('./public/javascripts/merge.js');
b.add('./public/javascripts/conges.js');
b.add('./public/javascripts/index.js');
app.get('/bundle.js', function (req,res) {
    res.set('Content-Type','application/javascript');
    b.bundle().pipe(res);
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var controller = new Controller();

app.get('/boulangeries', function (req, res) {
    var lat = req.param("lat") || 48.857558;
    var lng = req.param("lng") || 2.340084;
    controller.near(lat, lng, function (err, docs) {
        if (err) res.send(err);
        else res.json(docs);
    });
});

app.get('/geocode', function (req, res) {
    controller.geocode(req.param("addr"), function (err, data) {
        if (err) res.send(err);
        else res.json(data);
    })
});
