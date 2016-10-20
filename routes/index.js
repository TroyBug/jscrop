var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var fileupload = require('fileupload');
//graphicsmagick、ImageMagick required
//they are stand-alone programs,not a npm module
//download link:http://www.graphicsmagick.org/
//http://www.imagemagick.org/
//maybe need to restart after install if you work in windows. 
var gm = require('gm');

//use multer
var multer = require('multer');
var upload = multer({ dest: './public/images'});

//保存上传图片路径
var globalPath = '';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'js图像裁剪并上传Demo' });
});

router.get('/upload',function(req,res) {
	res.render('upload',{title:'图片上传'});
});

//uploadBtn is the name of input[file] in upload.ejs
router.post('/upload', upload.single('uploadBtn'), function(req,res) {
	if(!req.file.originalname) {
		res.send('<script>window.parent.handleError("请选择上传文件");history.go(-1);</script>');
	}
	//var path = req.file['uploadBtn'].path;
    var path = req.file['path'];
    //path would be like this:  public\images\798c224275d707cdb6c80acbf234e744.jpg
	path = path.replace(/\\/g,'/').replace('public','');
    globalPath = path;

    res.send('<script>window.parent.handleImg("'+path+'");history.go(-1);</script>');
});

router.post('/save',function(req,res) {
    //预览图left、top
    var x = req.body.x,
        y = req.body.y,
        preImgSize = req.body.preSize.split(',');   //预览图当前宽高


    gm('public'+globalPath).resize(preImgSize[0],preImgSize[1]).crop(150,150,x,y)
        .write('public/images/crop.jpg',function(err) {
        if(err) throw err;
        res.render('index',{title:'js图像裁剪并上传Demo'});
    });


});

module.exports = router;
