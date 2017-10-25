/**
 * Created by hughes on 2017/3/4.
 */
$(document).on("pageshow","#backPage",function(){
        $('.beginImg').removeClass('pulse');
});
$(document).on("pageshow","#listPage",function(){
    $('.beginImg').removeClass('pulse');
});
var question_link = "/19th/index.php/Home/Index/questions";
var rank_link = "/19th/index.php/Home/Index/moreRank";
var link_rank = "/19th/index.php/Home/Index/rank";
function loadImgs(b, g) {
    var f = {};
    var d = 0;
    for (var e = 0; e < b.length; e++) {
        var h = new Image();
        if(b[e] == 'startPage_back'){
            h.src = "/19th/Public/images/" + b[e] +".jpg";
        }else{
            h.src = "/19th/Public/images/" + b[e] +".png";
        }
        var c = b[e].split(".")[0];
        h.onload = function () {
            d++;
            if (d == b.length) {
                if (g) {
                    g()
                }
            }
        };
        f[c] = h
    }
    return f
}
function showPage(){
    $.mobile.loading('hide');
    $.mobile.changePage('#beginPage',{
            transition:'slide'
    });
}
$(function(){
    $.mobile.loading('show');
    var Imgs = ['VoiceofYoung','background_title','card_title','copper','developer_back','developer_title','list_title','silver','studyBtn','background_back','beginXi','content_back','cup','developer_btn','gold','orange_btn','startPage_back','yellow_btn'];
    loadImgs(Imgs,showPage);
    var touchBar = $('.courseList');
    var touchBox = $('.touchBar');
    var content_bar = $('.sentences');
    var content_box = $('.sentenceBox');
    var startPos = 0;
    var h = $(window).width()*0.69565;
    var h_content = 910 - $(window).width()*0.6751;
    touchBox[0].addEventListener('touchstart',function(e){
        e.preventDefault();
        var touch = e.touches[0];
        startPos = touch.pageY;
    });
    touchBox[0].addEventListener('touchmove',function(e){
        e.preventDefault();
        var touch = event.touches[0];
        var y = (touch.pageY - startPos);
        startTop = parseInt(touchBar.css('top'));
        if(startTop + y >= 0){
            touchBar.css('top',0);
        }else if(startTop + y <= -h){
            touchBar.css('top',-h);
        }else{
            touchBar.css('top',startTop+y);
            startPos+=y;
        }
    });
    content_box[0].addEventListener('touchstart',function(e){
        e.preventDefault();
        var touch = e.touches[0];
        startPos = touch.pageY;
    });
    content_box[0].addEventListener('touchmove',function(e){
        e.preventDefault();
        var touch = event.touches[0];
        var y = (touch.pageY - startPos);
        startTop = parseInt(content_bar.css('top'));
        if(startTop + y >= 0){
            content_bar.css('top',0);
        }else if(startTop + y <= -h_content){
            content_bar.css('top',-h_content);
        }else{
            content_bar.css('top',startTop+y);
            startPos+=y;
        }
    });
});

