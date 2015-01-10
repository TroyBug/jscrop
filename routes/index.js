var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var fileupload = require('fileupload');
var gm = require('gm');
//var im = require('imagemagick');
//var imageMagick = gm.subClass({ imageMagick: true });

var globalPath = '';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'js图像裁剪并上传Demo' });
});

router.get('/upload',function(req,res) {
	res.render('upload',{title:'图片上传'});
});

router.post('/upload',function(req,res) {
	if(!req.files.uploadBtn) {
		res.send('<script>window.parent.handleError("请选择上传文件");history.go(-1);</script>');
	}
	var path = req.files['uploadBtn'].path;
    //public\images\798c224275d707cdb6c80acbf234e744.jpg
	path = path.replace(/\\/g,'/').replace('public','');
    globalPath = path;

    res.send('<script>window.parent.handleImg("'+path+'");history.go(-1);</script>');
});

router.post('/save',function(req,res) {
    var x = req.body.x,
        y = req.body.y,
        preImgSize = req.body.preSize.split(',');


    gm('public'+globalPath).resize(preImgSize[0],preImgSize[1]).crop(150,150,x,y).write('public/images/crop.jpg',function(err) {
        if(err) throw err;
        res.render('index',{title:'js图像裁剪并上传Demo'});
    });


});

module.exports = router;
