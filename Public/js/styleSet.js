/**
 * Created by hughes on 2017/3/4.
 */
$(function(){
    var w = $(window).width();
    var content_back = $('.questionContainer');
    $('.background_content').css({'height':w*0.6});
    $(document).on("pagebeforeshow","#gamePage",function(){
        content_back.css('min-height',w*1.1);
    });
});