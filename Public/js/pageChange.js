/**
 * Created by hughes on 2017/3/4.
 */
timer = null;
timeNum = 5;
nextFlag = 0;
current = 1;
$(function () {
    var mask = $('.mask');
    var developer_list = $('.programerHolder');
    var close_developer = $('.closeP');
    var time_content = $('.time');
    var game_page = $('#gamePage');
    var next_question = $('.nextBtn');
    var q_title = $('.Qtitle');
    var q_content = $('.sentences');
    var myStudyBtn = $('.studyBtn');
    var replayBtn = $('.replayBtn');
    var day_num = $('.daynum');
    var word_num = $('.wordnum');
    var rank_num = $('.ranknum');
    var nickname = $('.nickname');
    var user_avatar = $('.user_avatar');
    var ranks = $('.list_rank');
    var top3 = ranks.find('li');
    var load_more = $('.load_more');
    var f = 51;
    load_more.on('click',function(){
        $.mobile.loading('show');
        var _data = {};
        _data.from = f;
        _data.to = f+9;
        $.post(rank_link,_data,function(data){
            $.mobile.loading('hide');
            if(data.status == 200){
                f += 10;
                for(var i = 0 ; i < data.data.length ; i++){
                    if(parseInt(data.data[i].rank)%2 != 0){
                        ranks.append('<li style="background: #feebcb"> <img src="'+data.data[i].imgurl+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data[i].nickname+'</span> <span class="list_ranknum">'+data.data[i].rank+'</span> </li>');
                    }else{
                        ranks.append('<li> <img src="'+data.data[i].imgurl+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data[i].nickname+'</span> <span class="list_ranknum">'+data.data[i].rank+'</span> </li>');
                    }
                }
            }else{
                alert(data.status)
            }
        })
    });
    replayBtn.on('click',function(){
        $.mobile.changePage('#beginPage',{
            transition:'flow'
        });
    });
    myStudyBtn.on('click',function(){
        $.mobile.changePage('#overPage',{
            transition:'flow'
        });
    });
   $('.startBtn').on('click',function(){
        $.mobile.changePage('#backPage',{
            transition:'flow'
        });
    });
    $('.Qc').on('click',function(){
        mask.css('display','block');
        developer_list.css('display','block');
    });
    close_developer.on('click',function(){
        mask.css('display','none');
        developer_list.css('display','none');
    });
    $('.listBtn').on('click',function(){
        $.mobile.loading('show');
        $.post(link_rank,"",function(data){
            if(data.status == 200){
                $.mobile.loading('hide');
                user_avatar.attr('src',data.data.avatar);
                nickname.html(data.data.nickname);
                rank_num.html(data.data.rank);
                word_num.html(data.data.groups);
                day_num.html(data.data.days);
            }else{
                alert(data.info);
            }
        });
        var _data = {};
        _data.from = 1;
        _data.to = 50;
        $.post(rank_link,_data,function(data){
            $.mobile.loading('hide');
            if(data.status == 200){
                for(var i = 0 ; i < data.data.length ; i++){
                    if(i<3){
                        top3.eq(i).find('.list_avatar').attr('src',data.data[i].imgurl);
                        top3.eq(i).find('.list_nickname').html(data.data[i].nickname);
                    }else{
                        if(i%2 == 0){
                            ranks.append('<li style="background: #feebcb"> <img src="'+data.data[i].imgurl+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data[i].nickname+'</span> <span class="list_ranknum">'+data.data[i].rank+'</span> </li>');
                        }else{
                            ranks.append('<li> <img src="'+data.data[i].imgurl+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data[i].nickname+'</span> <span class="list_ranknum">'+data.data[i].rank+'</span> </li>');
                        }
                    }
                }
                $.mobile.changePage('#listPage',{
                    transition: 'flow'
                })
            }else {
                alert(data.status);
            }
        });
    });
    $('.return').on('click',function(){
        $.mobile.changePage('#beginPage',{
            transition:'flow'
        });
    });
    $('.closeWarning').on('tap',function(){
        $('.overwarning').css('display','none');
        $('.mask').css('display','none');
    });
    $('.playBtn').on('click',function(){
        clearInterval(timer);
        time_content.html(5+' s');
        timeNum = 5;
        timer = setInterval(function(){
            timeNum--;
            time_content.html(timeNum+' s');
            if (timeNum == 0){
                nextFlag = 1;
                clearInterval(timer);
                time_content.html('下一个');
            }
        },1000);
        $.mobile.loading('show');
        $.post(question_link,1,function(data) {
            if (data.status == 200) {
                q_title.html(data.data.question.title);
                q_content.html(data.data.question.content);
                current = data.data.current;
                setTimeout(function () {
                    $.mobile.loading('hide');
                    $.mobile.changePage('#gamePage', {
                        transition: 'flow'
                    });
                }, 200)
            }
            else if (data.status == 403){
                $.mobile.loading('hide');
                $('.overwarning').css('display','block');
                $('.mask').css('display','block');
            }else{
                alert(data.error);
            }
        });
    });

    next_question.on('click',function(){
        if (nextFlag == 0){
            return false;
        }
        nextFlag = 0;
        console.log(current);
        if(current == 5){
            $.mobile.loading('show');
            $.post(link_rank,1,function(data){
                $.mobile.loading('hide');
                if(data.status == 200){
                    user_avatar.attr('src',data.data.avatar);
                    nickname.html(data.data.nickname);
                    rank_num.html(data.data.rank);
                    word_num.html(data.data.groups);
                    day_num.html(data.data.days);
                    $.mobile.changePage('#overPage',{
                        transition:'flow'
                    });
                    current = 0;
                    //shareDesc = '我正在参加 “团团打卡 学讲话” 特训，打卡第'+data.data.days+'天，排第'+data.data.rank+'名，明天继续！你也加入吧'
                    //initShare(shareTitle, shareDesc, shareURL, shareImg);
                }else {
                    alert(data.error);
                }
            });
            return false;
        }
        clearInterval(timer);
        time_content.html(5+' s');
        timeNum = 5;
        timer = setInterval(function(){
            timeNum--;
            time_content.html(timeNum+' s');
            if (timeNum == 0){
                nextFlag = 1;
                clearInterval(timer);
                time_content.html('下一个')
            }
        },1000);
        var _data = {};
        _data.new = "true";
        $.mobile.loading('show');
        $.post(question_link,_data,function(data){
            $.mobile.loading('hide');
            if(data.status == 200){
                game_page.attr('style'," ");
                game_page.css('min-height',$(window).height());
                q_title.html(data.data.question.title);
                q_content.html(data.data.question.content);
                current = data.data.current;
            }else{
                console.log(data.info);
            }
        });
    });
    $('.ok').on('click',function(){
        time_content.html(5+' s');
        timeNum = 5;
        $.mobile.changePage('#beginPage',{
            transition:'flow'
        });
    });
    $('.replay').on('click',function(){
        $.mobile.changePage('#backPage',{
            transition:'flow'
        });
        time_content.html(5+' s');
        timeNum = 5;
    });
});