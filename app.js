var express = require('express'),
stylus =  require('stylus'),
nib = require('nib');

var port = 3000;
var app = express();

function compile(str, path) {
	return stylus(str)
	.set('filename', path)
	.use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(stylus.middleware(
{
	src: __dirname + '/public',
	compile: compile
}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index',
        {
        });
});

app.get('/nochrome', function(req, res) {
    res.render('nochrome',
        {
            title: 'No Chrome!'
        });
});

console.log('Starting on port ' + port);
app.listen(port);
