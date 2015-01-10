function jscrop() {
        //图片容器
    var photoBox = get('photoBox'),
        //裁剪层
        cropBar = get('cropBar'),
        //用于配合裁剪层效果的图片
        cropImg = get('cropImg'),
        //原始图片
        originImg = get('originImg'),
        //触点层
        dragBar = get('dragBar'),
        //预览层
        preview = get('preview'),
        //预览层图片
        previewImg = get('previewImg'),
        //最外层图片容器的左边距
        photoBoxOffX = getCoods(photoBox).left,
        //最外层图片容器的上边距
        photoBoxOffY = getCoods(photoBox).top,
        //容器宽高
        photoBoxW = photoBox.offsetWidth,
        photoBoxH = photoBox.offsetHeight,
        //鼠标到图片内边距
        dx,dy,
        //拖动是否开始的标识
        dragStart = false,
        //鼠标按下时的位置
        startX,
        startY,
        d = document,
        dd = d.documentElement,
        db = d.body,
        //记录矩形选框的宽高，left，top值
        rect = {},
        //scrollTop、scrollLeft
        st,sl,
        //正在控制的触点
        dragPoint = '',
        min = Math.min,
        max = Math.max;

    var jscrop = {
        //初始化
        init:function() {
            jscrop.setProp.call(cropBar,{left:0,top:0,width:photoBoxW/2,height:photoBoxW/2});
            jscrop.setProp.call(dragBar,{left:0,top:0,width:photoBoxW/2,height:photoBoxW/2});
            jscrop.setProp.call(cropImg,{left:0,top:0});
            jscrop.show(cropBar);
            jscrop.show(dragBar);
            jscrop.show(preview);


            jscrop.setPreview(parseInt(cropBar.style.left),parseInt(cropBar.style.top),jscrop.getCropRatio()[0],jscrop.getCropRatio()[1]);

            originImg.className = 'originImg cursorStyle opacity';

            //为photoBox注册onmousedown事件
            addEvent(photoBox,'mousedown',jscrop.mdHandler);

            //为裁剪层注册onmousedown事件
            addEvent(cropBar,'mousedown',jscrop.dragCrop);

            //为触点层注册onmousedown事件
            addEvent(dragBar,'mousedown',jscrop.dragPoint);

            //取消裁剪事件
            addEvent(originImg,'mousedown',jscrop.cancelCrop);
            addEvent(d,'mousedown',jscrop.cancelCrop);
        },
        //触点控制
        dragPoint:function(e) {
            e = fixEvent(e);
            stopPropagation(e);
            preventDefault(e);
            var target = e.target || e.srcElement;
            //当前触点
            dragPoint = target.id;

            dragStart = true;

            //图片容器左边距上边距
            photoBoxOffX = getCoods(photoBox).left;
            photoBoxOffY = getCoods(photoBox).top;

            //浏览器滚动位置
            st = dd.scrollTop ? dd.scrollTop : db.scrollTop;
            sl = dd.scrollLeft ? dd.scrollLeft : db.scrollLeft;

            //记录起点坐标
            startX = e.clientX + sl;
            startY = e.clientY + st;

            //临时记录当前裁剪框的宽高
            rect.cropBarW = jscrop.getCropRatio()[0];
            rect.cropBarH = jscrop.getCropRatio()[1];

            //临时记录当前裁剪框的各个顶点坐标
            rect.coor = {};
            rect.coor.nw_coor_x = getCoods(cropBar).left;   //左上角顶点坐标
            rect.coor.nw_coor_y = getCoods(cropBar).top;
            rect.coor.ne_coor_x = rect.coor.nw_coor_x + jscrop.getCropRatio()[0];  //右上角顶点坐标
            rect.coor.ne_coor_y = rect.coor.nw_coor_y + jscrop.getCropRatio()[1];


            //注册鼠标移动和抬起事件
            addEvent(d,'mousemove',jscrop.dragPointMove);
            addEvent(d,'mouseup',jscrop.dragPointUp);
        },
        //触点移动
        dragPointMove:function(e) {
            if(!dragStart) return;
            e = fixEvent(e);

            preventDefault(e);
            stopPropagation(e);

            var currentX = e.clientX + sl,
                currentY = e.clientY + st;

            //限定边界
            currentX = Math.max(photoBoxOffX,currentX);
            currentX = Math.min(photoBoxOffX + photoBox.offsetWidth,currentX);

            currentY = Math.max(photoBoxOffY,currentY);
            currentY = Math.min(photoBoxOffY + photoBox.offsetHeight,currentY);

            switch (dragPoint) {
                case 'point-e'://右
                    rect.width = rect.cropBarW + currentX - rect.coor.ne_coor_x;
                    rect.height = rect.cropBarH;
                    break;
                case 'point-nw'://左上
                    rect.left = currentX - photoBoxOffX;
                    rect.top = currentY - photoBoxOffY;

                    rect.width = rect.coor.nw_coor_x - currentX + rect.cropBarW;
                    rect.height = rect.coor.nw_coor_y - currentY + rect.cropBarH;

                    break;
                case 'point-n'://上
                    rect.top = currentY - photoBoxOffY;
                    rect.height = rect.cropBarH + rect.coor.nw_coor_y - currentY;

                    break;
                case 'point-ne'://右上
                    rect.top = currentY - photoBoxOffY;

                    rect.width = rect.cropBarW + currentX - rect.coor.ne_coor_x;
                    rect.height = rect.cropBarH + rect.coor.nw_coor_y - currentY;

                    break;

                case 'point-se'://右下
                    rect.width = rect.cropBarW + currentX - rect.coor.ne_coor_x;
                    rect.height = rect.cropBarH + currentY - rect.coor.ne_coor_y;

                    break;
                case 'point-s'://下
                    rect.height = rect.cropBarH + currentY - rect.coor.ne_coor_y;

                    break;
                case 'point-sw'://左下
                    rect.left = currentX - photoBoxOffX;

                    rect.width = rect.cropBarW + rect.coor.nw_coor_x - currentX;
                    rect.height = rect.cropBarH + currentY - rect.coor.ne_coor_y;

                    break;
                case 'point-w'://左
                    rect.left = currentX - photoBoxOffX;
                    rect.width = rect.coor.nw_coor_x - currentX + rect.cropBarW;
                    break;
                default :
                    break;
            }


            jscrop.setProp.call(cropBar,{left:rect.left,top:rect.top,width:rect.width,height:rect.height});
            jscrop.setProp.call(dragBar,{left:rect.left,top:rect.top,width:rect.width,height:rect.height});
            jscrop.setProp.call(cropImg,{left:-rect.left,top:-rect.top});
            jscrop.setPreview(parseInt(cropBar.style.left),parseInt(cropBar.style.top),jscrop.getCropRatio()[0],jscrop.getCropRatio()[1]);

        },
        //触点鼠标抬起
        dragPointUp:function(e) {
            e = fixEvent(e);
            dragStart = false;

            //更新裁剪框的位置
            //jscrop.getCurrentPos();

            removeEvent(d,'mousemove',jscrop.dragPointMove);
            removeEvent(d,'mouseup',jscrop.dragPoint);
        },
        //裁剪框拖放按下
        dragCrop:function(e) {
            e = fixEvent(e);
            var target = e.target || e.srcElement;

            stopPropagation(e);
            preventDefault(e);

            //如果目标元素是裁剪层
            if(target.id === 'cropImg') {
                //拖放开始
                dragStart = true;

                //浏览器滚动位置
                st = dd.scrollTop ? dd.scrollTop : db.scrollTop;
                sl = dd.scrollLeft ? dd.scrollLeft : db.scrollLeft;

                //记录鼠标按下时的位置
                startX = e.clientX + sl;
                startY = e.clientY + st;

                //鼠标到裁剪层的内边距
                dx = startX - getCoods(cropBar).left;
                dy = startY - getCoods(cropBar).top;

                //注册鼠标移动事件
                addEvent(d,'mousemove',jscrop.dragCropMove);
                addEvent(d,'mouseup',jscrop.dragCropUp);
            }
        },
        //裁剪框拖放移动
        dragCropMove:function(e) {
            e = fixEvent(e);
            if(!dragStart) return;

            preventDefault(e);
            stopPropagation(e);

            var currentX = e.clientX + sl,
                currentY = e.clientY + st,
                maxX = photoBox.offsetWidth - parseInt(cropBar.getBoundingClientRect().right - cropBar.getBoundingClientRect().left),
                maxY = photoBox.offsetHeight - parseInt(cropBar.getBoundingClientRect().bottom - cropBar.getBoundingClientRect().top);


            rect.left = currentX - dx - photoBoxOffX;
            rect.top = currentY - dy - photoBoxOffY;



            //边界检测
            rect.left = Math.min(rect.left,maxX);
            rect.left = Math.max(0,rect.left);
            rect.top = Math.min(rect.top,maxY);
            rect.top = Math.max(0,rect.top);

            //设置各个元素的位置
            jscrop.setProp.call(cropBar,{left:rect.left,top:rect.top});
            jscrop.setProp.call(cropImg,{left:-rect.left,top:-rect.top});
            jscrop.setProp.call(dragBar,{left:rect.left,top:rect.top});
            jscrop.setPreview(parseInt(cropBar.style.left),parseInt(cropBar.style.top),jscrop.getCropRatio()[0],jscrop.getCropRatio()[1]);

        },
        //裁剪框拖放抬起
        dragCropUp:function() {
            dragStart = false;
            removeEvent(d,'mousemove',jscrop.dragCropMove);
            removeEvent(d,'mouseup',jscrop.dragCropUp);
        },
        //设置元素属性
        setProp:function(props) {
            var elStyle = this['style'],i;
            for(i in props) {
                if(props.hasOwnProperty(i)) {
                    elStyle[i] = props[i] + 'px';
                }
            }
        },
        //取消裁剪
        cancelCrop:function(e) {
            e = fixEvent(e);
            var target = e.target || e.srcElement;
            var tmpTag = target;
            while(tmpTag.id && tmpTag.id !== 'photoBox') {
                tmpTag = tmpTag.parentNode;
            }

            if(!dragStart) {
                //点击了裁剪框之外的部分则取消裁剪
                if(target.id === 'originImg' || tmpTag.id !== 'photoBox') {
                    jscrop.reset();
                }
            }
        },
        //显示元素
        show:function(el) {
            el.style.display = 'block';
        },
        //隐藏元素
        hide:function(el) {
            el.style.display = 'none';
        },
        //点击裁剪区域以外的部分，还原为原始状态
        reset:function() {
            //还原原始图的样式
            originImg.className = 'originImg cursorStyle';
            //隐藏
            jscrop.hide(cropBar);
            jscrop.hide(dragBar);
        },
        //鼠标按下事件
        mdHandler:function(e) {
            e = fixEvent(e);
            var target  = e.target || e.srcElement;

            preventDefault(e);

            //事件可能发生在裁剪层或触点层，这时不做操作
            if(target.id !== 'originImg') return;

            //鼠标移动开始
            dragStart = true;

            //浏览器滚动位置
            st = dd.scrollTop ? dd.scrollTop : db.scrollTop;
            sl = dd.scrollLeft ? dd.scrollLeft : db.scrollLeft;

            //记录鼠标按下时的位置
            startX = e.clientX + sl;
            startY = e.clientY + st;

            //记录当前图片容器的左边距及上边距
            photoBoxOffX = getCoods(photoBox).left;
            photoBoxOffY = getCoods(photoBox).top;

            //记录鼠标相对图片边界的位置
            dx = startX - photoBoxOffX;
            dy = startY - photoBoxOffY;

            //设置裁剪层，触点层和cropImg的初始位置
            jscrop.setProp.call(cropBar,{left:dx,top:dy});
            jscrop.setProp.call(dragBar,{left:dx,top:dy});
            jscrop.setProp.call(cropImg,{left:-dx,top:-dy});

            //按下的同时注册鼠标移动和抬起事件
            addEvent(d,'mousemove',jscrop.mmHandler);
            addEvent(d,'mouseup',jscrop.muHandler);
        },
        //鼠标移动事件
        mmHandler:function(e) {
            if(!dragStart) return;
            if(originImg.className !== 'originImg cursorStyle opacity') {
                originImg.className = 'originImg cursorStyle opacity';
            }

            e = e || window.event;

            var currentX = e.clientX + sl,
                currentY = e.clientY + st;

            //限制区域
            currentX = Math.max(photoBoxOffX,currentX);
            currentX = Math.min(photoBoxOffX + photoBoxW,currentX);

            currentY = Math.max(photoBoxOffY,currentY);
            currentY = Math.min(photoBoxOffY + photoBoxH,currentY);

            stopPropagation(e);
            preventDefault(e);

            rect.left = startX > currentX ? (currentX - photoBoxOffX) : (startX - photoBoxOffX);
            rect.top = startY > currentY ? (currentY - photoBoxOffY) : (startY - photoBoxOffY);

            rect.width = Math.abs(currentX - startX);
            rect.height = Math.abs(currentY - startY);

            //设置裁剪层的位置和大小
            jscrop.setProp.call(cropBar,{left:rect.left,top:rect.top,width:rect.width,height:rect.height});

            //设置触点层的位置和大小
            jscrop.setProp.call(dragBar,{left:rect.left,top:rect.top,width:rect.width,height:rect.height});

            //设置cropImg的位置
            jscrop.setProp.call(cropImg,{left:-rect.left,top:-rect.top});
            //设置previewImg的位置
            jscrop.setPreview(parseInt(cropBar.style.left),parseInt(cropBar.style.top),jscrop.getCropRatio()[0],jscrop.getCropRatio()[1]);


            //显示裁剪层和触点层
            jscrop.show(cropBar);
            //jscrop.show(dragBar);
        },
        muHandler:function(e) {
            stopPropagation(e);
            preventDefault(e);
            dragStart = false;
            if(cropBar.style.display == 'block') {
                //鼠标抬起后才显示触点
                jscrop.show(dragBar);
            }

            if(!rect.width || !rect.height) {
                jscrop.reset();
            }


            //注销鼠标滑动事件
            removeEvent(d,'mousemove',jscrop.mmHandler);
            removeEvent(d,'mouseup',jscrop.muHandler);
        },
        /**
         * 处理预览图位置
         * @param cx {number} 裁剪框left值
         * @param cy {number} 裁剪框top值
         * @param cw {number} 裁剪框宽度
         * @param ch {number} 裁剪框高度
         **/
        setPreview:function(cx,cy,cw,ch) {
            var width = Math.round(150 * photoBoxW / cw),
                height = Math.round(150 * photoBoxH / ch),
                left = -Math.round(150 / cw * cx),
                top = -Math.round(150 / ch * cy),
                inp_x = get('cx'),
                inp_y = get('cy'),
                inp_w = get('cw'),
                inp_h = get('ch'),
                preImgSize = get('preImgSize'),
                previewImg = get('previewImg');


            inp_w.value = 150;
            inp_h.value = 150;


            jscrop.setProp.call(previewImg,{left:left,top:top,width:width,height:height});
            inp_x.value = Math.abs(parseInt(previewImg.style.left)) || 0;
            inp_y.value = Math.abs(parseInt(previewImg.style.top)) || 0;
            preImgSize.value = ''+(parseInt(previewImg.style.width) || 0)+','+(parseInt(previewImg.style.height) || 0)+'';
        },
        //获取裁剪区域的宽高
        getCropRatio:function() {
            var width = Math.round(cropBar.getBoundingClientRect().right - cropBar.getBoundingClientRect().left),
                height = Math.round(cropBar.getBoundingClientRect().bottom - cropBar.getBoundingClientRect().top);

            return [width,height];
        }
    };
    return jscrop;
}

//jscrop().init();


