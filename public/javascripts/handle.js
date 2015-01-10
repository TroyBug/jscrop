function getCoods(el) {
    var left = el.offsetLeft,
        top = el.offsetTop,
        parent = el.offsetParent;

    while(parent != null) {
        left += parent.offsetLeft;
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }

    return {
        top: top,
        left: left
    };
}
function get(id) {
    return typeof id === 'string' ? document.getElementById(id) : id;
}
function addEvent(el,type,handler) {
    if(el.addEventListener) {
        el.addEventListener(type,handler,false);
        addEvent = function(el,type,handler) {
            el.addEventListener(type,handler,false);
        };
    } else if(el.attachEvent) {
        el.attachEvent('on'+type,handler);
        addEvent = function(el,type,handler) {
            el.attachEvent('on'+type,handler);
        };
    } else {
        el['on'+type] = handler;
        addEvent = function(el,type,handler) {
            el['on'+type] = handler;
        };
    }
}
function removeEvent(el,type,handler) {
    if(el.removeEventListener) {
        el.removeEventListener(type,handler,false);
        removeEvent = function(el,type,handler) {
            el.removeEventListener(type,handler);
        };
    } else if(el.detachEvent) {
        el.detachEvent('on'+type,handler);
        removeEvent = function(el,type,handler) {
            el.detachEvent('on'+type,handler);
        };
    } else {
        el['on'+type] = null;
        removeEvent = function(el,type) {
            el['on'+type] = null;
        };
    }
}
function stopPropagation(e) {
    e = e || window.event;
    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
}
function preventDefault(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}
function fixEvent(e) {
    return e || window.event;
}

function handleImg(path) {
    path = decodeURIComponent(path);
    var cropImg = get('cropImg'),
        originImg = get('originImg'),
        previewImg = get('previewImg'),
        photoBox = get('photoBox');
        image = new Image();

    image.onload = function() {
        cropImg.src = path;
        previewImg.src = path;
        originImg.src = path;

        DrawImage(cropImg,400,400);
        DrawImage(previewImg,400,400);
        DrawImage(originImg,400,400);
        photoBox.style.width = originImg.width + 'px';
        photoBox.style.height = originImg.height + 'px';

        jscrop().init();
    };
    image.src = path;
}

function handleError(s) {
    alert(s);
}

//图片,允许的宽度,允许的高度
function DrawImage(ImgD, iwidth, iheight) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= iwidth / iheight) {
          if (image.width > iwidth) {
            ImgD.width = iwidth;
            ImgD.height = (image.height * iwidth) / image.width;
          } else {
            ImgD.width = image.width;
            ImgD.height = image.height;
          }
        } else {
          if (image.height > iheight) {
            ImgD.height = iheight;
            ImgD.width = (image.width * iheight) / image.height;
          } else {
            ImgD.width = image.width;
            ImgD.height = image.height;
          }
        }
    }
}