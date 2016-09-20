var cluster         = require('cluster');
var os              = require('os');
var path 			= require('path');

uptime   = Date.now();

if (cluster.isMaster){
	var cpuCount = os.cpus().length;
	for (var i = 0; i < cpuCount; i++){
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
	  console.log(`worker ${worker.process.pid} died`);
	});
} else {
	var http            = require("http");
	var deepEqual   	= require("deep-equal");
	var compression 	= require("compression");
	var express     	= require("express");
	var bodyParser  	= require("body-parser");
	var passport    	= require('passport');
	var GoogleStrategy	= require('passport-google-oauth').OAuth2Strategy;
	var discretka   	= require("discretka");
	var session     	= require( 'express-session' );
	var cookieParser 	= require('cookie-parser')
	var schedule		= require('node-schedule')
	var request 		= require('request')
	// database
	var db				= require("./db");
	var TestSchema		= require("./schemas/test");
	var StudentSchema	= require("./schemas/students");

	var bitcly 			= require('bitcly');
	var otchet			= require("./otchet");



	var app = express();
	server = http.createServer(app).listen(8888);
	console.log('diophantine');

	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(compression());
	app.use(express.static("public"));
	app.use(session({ secret: 'anything' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	passport.use(new GoogleStrategy({
		    clientID: "513372868036-4l565puo9frjoa3hgva3ovj3s7oohda2.apps.googleusercontent.com",
		    clientSecret: "nsEQDE87SK0XHprTi60VRLj1",
		    callbackURL: "http://discrete-eltech.eurodir.ru:8888/auth/google/callback"
	  	}, function (accessToken, refreshToken, profile, done) {
	  		profile.access_token = accessToken;
	    	done(null, profile)
		}
	));

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  done(null, user);
	});

	app.get('/solve/:method', function(req,res){
		req.params.method = req.params.method.toLowerCase()
		if (discretka.hasOwnProperty(req.params.method)){
			if (req.params.method == 'pem'){
				if (req.query.a !== undefined && req.query.a !== undefined){
					a = parseInt(req.query.a);
					b = parseInt(req.query.b);
					res.jsonp( discretka[req.params.method].solve(a, b) );
				} else res.jsonp();
			}
			else res.jsonp( discretka[req.params.method].solve() );
		} else { res.status(404).jsonp({"result": "404, "+req.params.method+" not found."}) }
	});

	app.get('/test/:method', function(req, res){
		console.log(req.query);
		req.params.method = req.params.method.toLowerCase()
		if (discretka.hasOwnProperty(req.params.method)){
			obj = discretka[req.params.method].create();
			test = new TestSchema({
				_student: req.query.id,
				object: {input: obj.input},
				testName: req.params.method
			});
			test.save(function(err, test){
				obj.test_id = test.id;
				res.jsonp( obj );
			});
		} else { res.status(404).jsonp({"result": "404, "+req.params.method+" not found."}) }
	});

	app.post('/test/:method', function(req, res, next){
		req.params.method = req.params.method.toLowerCase()
		discretka[req.params.method].properties.forEach(function(name){
			if (!req.body.hasOwnProperty(name)){
				res.status(400).jsonp({status: false, text: 'Not found properties in request. Do you have input, output, table?'});
				next();
				return false;
			}
		});
		if (!req.body.hasOwnProperty("test_id")){
			res.status(400).jsonp({status: false, text: 'There is no test_id. That is why I cannot save your data.'});
			return false;
		}
		var a = typeof req.body.input[0] === 'object' ? req.body.input[0] : parseInt(req.body.input[0]);
		var b = parseInt(req.body.input[1]);
		var c = req.body.input.length == 3 ? parseInt(req.body.input[2]) : null;
		if ((isNaN(a) && typeof a != 'object') || isNaN(b) || isNaN(c)){
			res.status(400).jsonp({status: false, text: 'Check you input. This is not numbers, isn\'t it?'});
			return false;
		} else {
			var test_id = req.body.test_id;
			delete req.body.test_id;

			console.log(a,b,c);
			console.log('THIS IS REQUEST:');
			console.log(req.body);
			console.log('THIS IS SERVER SOLUTION:')
			
			server_solution =  (c == null) ? discretka[req.params.method].solve(a, b) : server_solution = discretka[req.params.method].solve(a, b, c);
			console.log(server_solution);

			switch (req.params.method){
				case 'diophantine':
					class_x = (req.body.output.x[0] - server_solution.output.x[0]) % server_solution.output.x[1] == 0;
					class_y = (req.body.output.y[0] - server_solution.output.y[0]) % server_solution.output.y[1] == 0;
					t_x = Math.abs(req.body.output.x[1]) == Math.abs(server_solution.output.x[1]);
					t_y = Math.abs(req.body.output.y[1]) == Math.abs(server_solution.output.y[1]);  
					t_s = req.body.output.y[1]*req.body.output.x[1] < 0;
					t_c = req.body.output.x[0]*req.body.input[0]+req.body.output.y[0]*req.body.input[1] == req.body.input[2];
					isSimilar = class_y && class_x && t_x && t_y && t_s && t_c;
					break;
				case 'axby1':
					if ((req.body.table[2][ req.body.table[2].length -1 ] == '') && (req.body.table[3][ req.body.table[3].length -1 ] == '')){
						server_solution.table[2][ server_solution.table[2].length -1 ] = '';
						server_solution.table[3][ server_solution.table[3].length -1 ] = '';
					}
					isSimilar = deepEqual(req.body, server_solution );
					break;
				case 'inverse':
					delete server_solution.table;
					isSimilar = deepEqual(req.body.input, server_solution.input ) && ((req.body.output - server_solution.output) % req.body.input[0] == 0);
					break;
				default: 
					isSimilar = deepEqual(req.body, server_solution );
			}

			if (isSimilar){
				TestSchema.findById(test_id, function(err, data){
					if (deepEqual(data.object.input, req.body.input)){
						data.object = req.body;
						data.finished = Date.now();
						data.save(function(){
							console.log(data);
							if (err) console.log(err);
							res.jsonp({status: isSimilar});
						});
					} else res.status(400).jsonp({status: false, text: 'Fake test_id.'});
				});
			} else {
				console.error('Dude sent wrong answer');
				res.jsonp({status: isSimilar, text: 'Wrong answer.'});
				return false;
			}
		}
	});

	app.get('/getgroup/:group_id', function(req, res){
		StudentSchema.find({group: req.params.group_id}, function(err, data){
			if (err) { console.log(err); res.jsonp([]);}
			else res.jsonp(data);
		}).sort({last_name: 1});
	});

	app.get('/g/list', (req,res) => {
		aggr = [
			{
				$group: {
			    	_id: "$group",
			    	count: {$sum: 1}
			    },
			},
			{
				$sort: {
					_id: -1
				}
			}
		]
		StudentSchema.aggregate(aggr, (err, data)=>{
			if (err) res.jsonp([])
			else {
				megadata = []
				for (i = 0; i < data.length; i++)
					if (data[i]._id == null)
						megadata.push(["группа не указана", data[i].count])
					else
						megadata.push([data[i]._id, data[i].count])
				res.jsonp(megadata)
			}
		})
	})

	app.get('/s/:student_id/tests', (req,res) => {
		var result = {count: 0, duration_avg: 0, tests: {}}
		TestSchema.find({_student:req.params.student_id, finished: {$exists: true} }, 'id testName started finished object',  (err,data) => {
			if (err) res.jsonp(err);
			else {
				result.tests = JSON.parse(JSON.stringify(data));
				for (i = 0; i < result.tests.length; i++){
					result.tests[i].duration = 0.001*(Date.parse(result.tests[i].finished) - Date.parse(result.tests[i].started));
					result.count++;
					result.duration_avg += result.tests[i].duration/result.tests.length;
				}
				res.jsonp(result);
			}
		}).sort({finished: -1})
	});

	app.get('/s/:student_id/info', (req, res) => {
		StudentSchema.findById(req.params.student_id, (err,data) => {
			if (!err) res.jsonp(data);
		});
	});

	app.post('/s/:student_id/update', (req, res) =>{
		if (req.body.hasOwnProperty('website')){
			bitcly(req.body.website)
			  .then(url => 
			  	{ 
			  		console.log(url);
			  		req.body.website = url;
			  		StudentSchema.findByIdAndUpdate(req.params.student_id, req.body, (err, doc)=>{
			  			console.log(req.body)
			  			if (err) res.jsonp({status: false, err: err})
			  			else {
			  				res.jsonp({status: true})
			  			}
			  		})
			  	})
			  .catch(error => { console.log(error); });
		} else {
			StudentSchema.findByIdAndUpdate(req.params.student_id, req.body, (err, doc)=>{
				console.log(req.body)
				if (err) res.jsonp({status: false, err: err})
				else {
					res.jsonp({status: true})
				}
			})
		} 
	})

	app.get('/s/search', (req, res) => {
		megadata = []
		callbacks = 0
		if (req.query.hasOwnProperty("q")){
			StudentSchema.find({$or: [
				{last_name: new RegExp('.*'+req.query.q+'.*', "i")},
				{first_name: new RegExp('.*'+req.query.q+'.*', "i")} ]}, (err,data) => {
				if (!err && data.length > 0) {
					for (i = 0; i < data.length; i++)
						megadata.push(data[i])
				}
				res.jsonp(megadata);
			});
		} else { 
			megadata = {status: false, text: 'Missing q parameter. Nothing happens.'};
			res.jsonp(megadata);
		}
	});

	app.get('/db/stats', (req,res) => {
		TestSchema.collection.stats((err, data) => {
			res.jsonp(data)
		})
	})

	app.get('/server/status.json', function(req,res){
		server.getConnections(function(err, count){
			callbacks = 0;
			data = {
				load: os.loadavg(),
				freemem: os.freemem(),
				uptime: os.uptime(),
				node_uptime: Math.floor((Date.now()-uptime)/1000),
				architecture: os.arch(),
				platform: os.platform(),
				connections: count,
				tests: {},
				tests_freeq: {},
				students: {}
			}

			TestSchema.collection.stats((err, stats) => {
				callbacks++;
				data.tests.size  = stats.size + stats.totalIndexSize;
				data.tests.count = stats.count;
				if (callbacks == 2) res.jsonp(data);
			});
			StudentSchema.collection.stats((err, stats) => {
				callbacks++;
				data.students.size = stats.size + stats.totalIndexSize;
				data.students.count = stats.count;
				if (callbacks == 2) res.jsonp(data);
			});
		});
	});

	app.get('/auth/google', passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.me https://sites.google.com/feeds/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

	app.get('/auth/google/callback', passport.authenticate('google', {
	        successRedirect: '/auth/google/success',
	        failureRedirect: '/auth/google/fail'
	    }));

	app.get('/auth/google/success', function(req, res){
		if (req.hasOwnProperty('user')){
			user = req.user;
			photo = user.photos[0].value.slice(0, -2) + "100";

			var options = {
			  url: 'https://sites.google.com/feeds/site/site?alt=json',
			  headers: {
			    'Authorization': 'Bearer '+user.access_token
			  }
			};

			// Запрос к гугл сайтам
			request(options, (err, response, body)=>{
				website = null;
				group = null;
				body = JSON.parse(body);
				console.log(body);
				if (body.feed.hasOwnProperty('entry')){
					title = body.feed.entry[0].title.$t;
					group = isNaN(title.slice(-4)) ? null : title.slice(-4);
			    	website = body.feed.entry[0].link[0].href;
				}	

			    student = new StudentSchema({
			    	first_name: user.name.givenName,
			    	last_name: user.name.familyName,
			    	gender: user.gender,
			    	email: user.emails[0].value,
			    	photo: photo,
			    	website: website,
			    	group: group
			    });

			    student.save(function(err, student){
			    	if (err) {
			    		if (err.code == 11000){
			    			StudentSchema.findOne({"email": user.emails[0].value}, "id", function(err, doc){
			    				res.cookie('student_id', doc.id, { expires: new Date(Date.now() + 31536000000) });
			    				res.redirect('/');
			    			})
			    		} else {
			    			console.log(err);
			    			res.redirect('/');
			    		}
			    	} else {
			    		res.cookie('student_id', student.id, { expires: new Date(Date.now() + 31536000000) });
			    		res.redirect('/');
			    	}
			    });

			})
		} else {
			res.redirect('/auth/google');
		}
	});

	app.get('/auth/google/fail', function(req, res){
		res.jsonp("Authentication failed");
	});

	app.get('/logout', function (req, res) {
	        req.logOut();
	        res.redirect('/');
	    });

	app.get('/generatedoc', (req, res) => {
		otchet();
		date = new Date();
		res.download(path.join(__dirname, '/public', 'otchet.docx'), 'Отчет сервера '+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+'.docx');
	})

	app.get(/.*/, (req,res) => {
		res.sendFile(path.join(__dirname, '/public', 'index.html'));

	})

	if (cluster.worker.id == 1) {
		var j = schedule.scheduleJob('20 4 * * *', function(){
			TestSchema.remove({ finished: {$exists: false} }, function (err) {
			  if (err) console.error(err);
			  otchet();
			  console.info('Произведена очистка Базы данных от нерешенных задач');
			});
		});
	}

}