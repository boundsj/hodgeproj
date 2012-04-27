
/**
 * Module dependencies.
 */

var express = require('express'), 
    routes = require('./routes'),
    proj4js = require('./proj4js-combined'),
    hodgeproj = require('./hodgeproj4'),
    defs = require('./defs/EPSG2249.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // uncomment for pretty print html
  //app.set('view options', { pretty: true });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/api/translate/:lat/:lon/:from/:to', function(req, res){
  console.log(req.params.lon, req.params.lat, req.params.from, req.params.to);
  transformation = HodgeProj4.transform(req.params.lon.toString(), req.params.lat)
                             .from(req.params.from)
                             .to(req.params.to);
  res.send({"result": 
           {"projection": req.params.to,
                   "lat": transformation.point.x, 
                   "lon": transformation.point.y}});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
