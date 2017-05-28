var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var mongoose = require('mongoose');
var movie = require('./models/movie.js');
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/movieweb');

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.bodyParser())
app.use(serveStatic('bower_components'))
app.use(serveStatic('public'));
var _underscore = require('underscore'); // _.extend用新对象里的字段替换老的字段

// app.use(express.static(path.join(_dirname, 'bower_components')))
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port' + port)

//index page
app.get('/', function(req, res) {
  // res.render('index',{
  //   title:'首页',
  //   movies:[{
  //     title:'机械战警',
  //     _id: 1,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
  //   },{
  //     title:'机械战警',
  //     _id: 2,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
  //   },{
  //     title:'机械战警',
  //     _id: 3,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
  //   },{
  //     title:'机械战警',
  //     _id: 4,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
  //   },{
  //     title:'机械战警',
  //     _id: 5,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
  //   },{
  //     title:'机械战警',
  //     _id: 6,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
  //   }]

  // })
  movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {  // 渲染index 首页
            title: 'movieweb 首页',
            movies: movies
        });
    });
})

//detail page
app.get('/movie/:id', function(req, res) {
  // res.render('detail', {
  //   title:'详情页',
  //   movie: {
  //     doctor: '何塞 帕迪利亚',
  //     country: '美国',
  //     year: 2014,
  //     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
  //     language: '英语',
  //     flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
  //     summary: '翻拍自1987年同名科幻经典'
  //   }
  // })
  var id = req.params.id;
    movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'movieweb' + movie.title,
            movie: movie
        });
    });
})

//admin page
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title:'后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})
// admin update movie 后台更新页
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'movieweb 后台更新页',
                movie: movie
            });
        });
    }
});

// admin post movie 后台录入提交
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if (id !== 'undefined') { // 已经存在的电影数据
        movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _underscore.extend(movie, movieObj); // 用新对象里的字段替换老的字段
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {  // 新加的电影
        _movie = new movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
});

//list page
app.get('/admin/list', function(req, res) {
  // res.render('list', {
  //   title:'列表页',
  //   movies: [{
  //     title: '机械战警',
  //     _id: 1,
  //     doctor: '何塞 帕迪利亚',
  //     country: '美国',
  //     year: 2014,
  //     language: '英语',
  //     flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
  //   }]
  // })
  movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'i_movie 列表页',
            movies: movies
        });
    });
})