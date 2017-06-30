var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var agenda = require('agenda')({ db: { address: 'mongodb://mor4095:mor4095@ds033629.mongolab.com:33629/mor4095' } });
//var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');
var compress = require('compression');
var imdb = require('imdb-api');

var showSchema = new mongoose.Schema({
    _id: String,
    name: String,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: Date,
    genre: [String],
    network: String,
    overview: String,
    rating: Number,
    ratingCount: Number,
    status: String,
    poster: String,
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    episodes: [{
        season: Number,
        episodeNumber: Number,
        episodeName: String,
        firstAired: Date,
        overview: String
    }]
});

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
var Show = mongoose.model('Show', showSchema);
//mongoose.connect('localhost');
mongoose.connect('mongodb://mor4095:mor4095@ds033629.mongolab.com:33629/mor4095');


/*agenda.define('send email alert', function(job, done) {
    Show.findOne({ name: job.attrs.data }).populate('subscribers').exec(function(err, show) {
        var emails = show.subscribers.map(function(user) {
            return user.email;
        });

        var upcomingEpisode = show.episodes.filter(function(episode) {
            return new Date(episode.firstAired) > new Date();
        })[0];

        var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: { user: 'hslogin', pass: 'hspassword00' }
        });

        var mailOptions = {
            from: 'Fred Foo ✔ <foo@blurdybloop.com>',
            to: emails.join(','),
            subject: show.name + ' is starting soon!',
            text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
            'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
        };

        smtpTransport.sendMail(mailOptions, function(error, response) {
            console.log('Message sent: ' + response.message);
            smtpTransport.close();
            done();
        });
    });
});

agenda.start();

agenda.on('start', function(job) {
    console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function(job) {
    console.log("Job %s finished", job.attrs.name);
});*/

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
        });
    });
}));

/*var fs = require('fs'),
    http = require('http'),
    url = require('url');

var movie_webm, movie_mp4, movie_ogg;
// ... [snip] ... (Read index page)
fs.readFile("I:\\incoming2\\feast.2015.bdrip.xvid-tars-hebsubs-eliran-gozlan-2015.avi", function (err, data) {
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});
// ... [snip] ... (Read two other formats for the video)

// Serve & Stream Video

http.createServer(function (req, res) {
    if (req.url != "/feast.2015.bdrip.xvid-tars-hebsubs-eliran-gozlan-2015.avi") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end('<video src="http://localhost:8888/feast.2015.bdrip.xvid-tars-hebsubs-eliran-gozlan-2015.avi" controls></video>');
    } else {
        var file = path.resolve(__dirname,"movie.mp4");
        var range = req.headers.range;
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);

        fs.stat(file, function(err, stats) {
            var total = stats.size;
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end - start) + 1;

            res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            });

            var stream = fs.createReadStream(file, { start: start, end: end })
                .on("open", function() {
                    stream.pipe(res);
                }).on("error", function(err) {
                    res.end(err);
                });
        });
    }
}).listen(8888);*/


var app = express();
app.set('port', process.env.PORT || 3000);
app.use(compress())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 })); // 86400000 = 1 day
//app.use(express.static('I:\incoming2'));

app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


app.get('/api/shows', function(req, res, next) {
    var query = Show.find();
    if (req.query.genre) {
        query.where({ genre: req.query.genre });
    } else if (req.query.alphabet) {
        query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
    } else {
        query.limit(12);
    }
    query.exec(function(err, shows) {
        if (err) return next(err);
        res.send(shows);
    });
});

app.get('/api/shows/:id', function(req, res, next) {
    Show.findById(req.params.id, function(err, show) {
        if (err) return next(err);
        res.send(show);
    });
});

/*app.get('/api/logout', function(req, res, next) {
    req.logout();
    res.send(200);
});*/

/*app.post('/api/shows', function(req, res, next) {
    var apiKey = '9EF1D1E7D28FDA0B';
    var parser = xml2js.Parser({
        explicitArray: false,
        normalizeTags: true
    });
    var seriesName = req.body.showName
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^\w-]+/g, '');

    async.waterfall([
        function(callback) {
            request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
                if (error) return next(error);
                parser.parseString(body, function(err, result) {
                    if (!result.data.series) {
                        return res.send(404, { message: req.body.showName + ' was not found.' });
                    }
                    var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
                    callback(err, seriesId);
                });
            });
        },
        function(seriesId, callback) {
            request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
                if (error) return next(error);
                parser.parseString(body, function(err, result) {
                    var series = result.data.series;
                    var episodes = result.data.episode;
                    var show = new Show({
                        _id: series.id,
                        name: series.seriesname,
                        airsDayOfWeek: series.airs_dayofweek,
                        airsTime: series.airs_time,
                        firstAired: series.firstaired,
                        genre: series.genre.split('|').filter(Boolean),
                        network: series.network,
                        overview: series.overview,
                        rating: series.rating,
                        ratingCount: series.ratingcount,
                        runtime: series.runtime,
                        status: series.status,
                        poster: series.poster,
                        episodes: []
                    });
                    _.each(episodes, function(episode) {
                        show.episodes.push({
                            season: episode.seasonnumber,
                            episodeNumber: episode.episodenumber,
                            episodeName: episode.episodename,
                            firstAired: episode.firstaired,
                            overview: episode.overview
                        });
                    });
                    callback(err, show);
                });
            });
        },
        function(show, callback) {
            var url = 'http://thetvdb.com/banners/' + show.poster;
            request({ url: url, encoding: null }, function(error, response, body) {
                show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
                callback(error, show);
            });
        }
    ], function(err, show) {
        if (err) return next(err);
        show.save(function(err) {
            if (err) {
                if (err.code == 11000) {
                    return res.send(409, { message: show.name + ' already exists.' });
                }
                return next(err);
            }
            res.send(200);
        });
    });
});*/

app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
});

app.post('/api/addNewDir', function(req, res, next) {




    var fs = require("fs"),path = require("path");
    /*var movie;
    imdb.getReq({ id: '0090190' }, function(err, things) {
        movie = things;
        console.log(things);
        console.log('*******');
    });

    console.log("3");
    console.log(movie);*/
    console.log(req.body.dirName);
    var p =req.body.dirName;//"../"

    fs.readdir(p, function (err, files) {
        if (err) {
            console.log("3");
            throw err;
        }
        console.log("4");
        files.map(function (file) {
            console.log("5");
            return path.join(p, file);
        }).filter(function (file) {
            console.log("6");
            return fs.statSync(file).isFile();
        }).forEach(function (file) {

            var movieName = path.basename(file).substr(0,path.basename(file).indexOf(path.basename(file).match(/\d|\(/)));
            console.log(movieName);


            request.get('http://www.omdbapi.com/?t='+movieName+'&r=json&type=movie', function(error, response, body) {
                if (error)
                {

                    console.log('errorLog0=');
                    console.log(response);
                    console.log(body);
                    console.log(error);
                    return;
                    //return next(error);
                }
                var jMovie = JSON.parse(body);

                if(jMovie.Response=='True' && jMovie.imdbRating!='N/A')
                {

                    //console.log(jMovie);
                    //console.log(jMovie);
                    //console.log(jMovie.Title);
                    var show = new Show({
                         _id: jMovie.imdbID,
                        name: jMovie.Title,
                        genre: jMovie.Genre.split(',').filter(Boolean),
                        rating: jMovie.imdbRating,
                        runtime: jMovie.Runtime,
                        overview : jMovie.Plot,
                        poster : jMovie.Poster
                    });


                    if(jMovie.Poster!='N/A')
                    {
                        var url = jMovie.Poster;
                        request({url: url, encoding: null}, function (error, response, body) {
                            show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
                        });
                    }


                    show.save(function(err) {
                        if (err) {

                            if (err.code != 11000) {//already exists
                                console.log('errorLog1=');
                                console.log(show);
                                console.log(err);
                                //return res.send(409, { message: show.name + ' already exists.' });
                                return next(err);
                            }
                            //return next(err);
                        }

                    });
                }



                //console.log(jMovie);
                /*var show = new Show({
                    _id: jMovie.imdbID,
                    name: jMovie.Title,
                    genre: jMovie.Genre.split(',').filter(Boolean),
                    rating: jMovie.imdbRating,
                    runtime: jMovie.Runtime,
                    poster: jMovie.Poster
                });

                show.save(function(err) {
                    if (err) {
                        if (err.code == 11000) {
                            return res.send(409, { message: show.name + ' already exists.' });
                        }
                        return next(err);
                    }
                    res.send(200);
                });*/

            });

            /*console.log(file);
            var movieName = path.basename(file).substr(0,path.basename(file).indexOf(path.basename(file).match(/\d/)));
            console.log(movieName);
            var show = new Show();
            show.name = movieName;
            show.save(function(err) {
                if (err) {
                    if (err.code == 11000) {
                        return res.send(409, { message: show.name + ' already exists.' });
                    }
                    return next(err);
                }
                res.send(200);
            });*/

        });
    });

    //res.cookie('user', JSON.stringify(req.user));*/
    res.send(200);
});

/*app.post('/api/signup', function(req, res, next) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if (err) return next(err);
        res.send(200);
    });
});

app.post('/api/subscribe', ensureAuthenticated, function(req, res, next) {
    Show.findById(req.body.showId, function(err, show) {
        if (err) return next(err);
        show.subscribers.push(req.user.id);
        show.save(function(err) {
            if (err) return next(err);
            res.send(200);
        });
    });
});

app.post('/api/unsubscribe', ensureAuthenticated, function(req, res, next) {
    Show.findById(req.body.showId, function(err, show) {
        if (err) return next(err);
        var index = show.subscribers.indexOf(req.user.id);
        show.subscribers.splice(index, 1);
        show.save(function(err) {
            if (err) return next(err);
            res.send(200);
        });
    });
});*/

/*app.use(function(err, req, res, next) {
    console.log('errorLog2=');
    console.error(err.stack);
    res.send(500, { message: err.message });
});*/

/*function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.send(401);
}*/