/**
 * Created by hughes on 2017/3/4.
 */
$(function(){
    var w = $(window).width();
    var content_back = $('.questionContainer');
    var courseList = $('.courseList').find('li');
    var courseNum = $('.courseNum');
    courseNum.css({'height':w*0.15467,'line-height':w*0.15467+'px'});
    courseList.css({'height':w*0.08775,'line-height':w*0.08775+'px'});
    $('.background_content').css({'height':w*0.8});
    $(document).on("pagebeforeshow","#gamePage",function(){
        content_back.css('height',w*0.95);
    });
    $('.sentenceBox').css({'height':w*0.65});
});