/* REQUIRES */
// ...npm
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ...local
var index = require('./routes/index.js');
var favicon = require('serve-favicon');

/* CONNECT TO MONGOOSE */
mongoose.connect(process.env.PROD_MONGODB || 'mongodb://localhost/risejs');


/* CONFIG APP */
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

// cookie sessions
// app.use(session({ 
//   secret: 'superS3CRE7',
//   resave: false,
//   saveUninitialized: false ,
//   cookie: {}
// }));

/* ROUTING */
app.get('/', index.game);
app.get('/getnewsong', index.getnewsong);
app.get('/getnsongs', index.getnsongs);
app.get('/game', index.game);
app.get('/getConfig', index.getConfig);
app.get('/reset', index.reset);
app.post('/updateConfig', index.updateConfig);
app.post('/saveEntry', index.saveEntry);
app.get('/getEntries', index.getEntries);

app.listen(process.env.PORT || 3000);
console.log("Running on port 3000");
