/**
 * Created by hughes on 2017/3/4.
 */
$(function(){
    var w = $(window).width();
    var content_back = $('.questionContainer');
    var courseList = $('.courseList').find('li');
    courseList.css({'height':w*0.08775,'line-height':w*0.08775+'px'});
    $('.background_content').css({'height':w*0.8});
    $(document).on("pagebeforeshow","#gamePage",function(){
        content_back.css('min-height',w*1.1);
    });
});