/* REQUIRES */
// ...npm
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
//var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ...local
var index = require('./routes/index.js');


/* CONNECT TO MONGOOSE */
//mongoose.connect(process.env.MONGOURI || 'mongodb://localhost/risejs');


/* CONFIG APP */
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// cookie sessions
// app.use(session({ 
//   secret: 'superS3CRE7',
//   resave: false,
//   saveUninitialized: false ,
//   cookie: {}
// }));

/* ROUTING */
app.get('/', index.home);
app.get('/getnewsong', index.getnewsong);
app.get('/setup', index.setup);


app.listen(process.env.PORT || 3000);
console.log("Running on port 3000");
