/**
 * Created by hughes on 2017/3/4.
 */
timer = null;
timeNum = 7;
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
    var rank_num = $('.ranknum');
    var nickname = $('.nickname');
    var user_avatar = $('.user_avatar');
    var ranks = $('.list_rank');
    var top3 = ranks.find('li');
    var warning = $('.overwarning');
    var ps = warning.find('p');
    var select_wrong = $('.select_wrong');
    var right_num = $('.right_num');
    var over_learnt = $('.over_learnt');
    var learn_completed = $('.learn_completed');
    var load_more = $('.load_more');
    var play_flag = 1;
    var aCourseNum = $('.courseList > li');
    var h_content = 0;
    var content_box = $('.sentenceBox');
    var startPos = 0;
    var courseNum = $('.courseNum');
    var over_flag = 0;
    content_box[0].addEventListener('touchstart',function(e){
        e.preventDefault();
        var touch = e.touches[0];
        startPos = touch.pageY;
        h_content = q_content[0].offsetHeight - $(window).width()*0.645;
    });
    content_box[0].addEventListener('touchmove',function(e){
        e.preventDefault();
        if(h_content < 0){
            return false;
        }
        var touch = event.touches[0];
        var y = (touch.pageY - startPos);
        startTop = parseInt(q_content.css('top'));
        if(startTop + y >= 0){
            q_content.css('top',0);
        }else if(startTop + y <= -h_content){
            q_content.css('top',-h_content);
        }else{
            q_content.css('top',startTop+y);
            startPos+=y;
        }
    });
    aCourseNum.on('tap',function(){
        if(!play_flag){
            return false;
        }
        q_content.css('top',0);
        play_flag = 0;
        clearInterval(timer);
        time_content.html(7+' s');
        timeNum = 7;
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
        var _data = {};
        _data.lession_id = parseInt($(this).html());
        $.post(question_link,_data,function(data) {
            if (data.status == 200) {
                q_title.html(data.data.question.title);
                q_content.html(data.data.question.content);
                courseNum.html(_data.lession_id);
                current = data.data.current;
                setTimeout(function () {
                    $.mobile.loading('hide');
                    $.mobile.changePage('#gamePage', {
                        transition: 'flow'
                    });
                    play_flag = 1;
                }, 200)
            }
            else if (data.status == 405){
                $.mobile.loading('hide');
                warning.css('display','block');
                mask.css('display','block');
                right_num.html(data.data);
                select_wrong.css('display','block');
                play_flag = 1;
            }else if(data.status == 403){
                $.mobile.loading('hide');
                warning.css('display','block');
                mask.css('display','block');
                over_learnt.css('display','block');
                play_flag = 1;
            }
            else{
                alert(data.error);
                play_flag = 1;
            }
        });
    });
    replayBtn.on('click',function(){
        $.mobile.loading('show');
        var _data = {};
        _data.lession_id = 77;
        $.post(question_link,_data,function(data){
            $.mobile.loading('hide');
            if(data.status == 200){
                aCourseNum.css('background-color','#f59a4e');
            }else if(data.status == 405){
                for(var i = 0 ; i < data.data ; i++){
                    aCourseNum.eq(i).css('background-color','#f59a4e');
                }
            }
            $.mobile.changePage('#backPage',{
                transition:'flow'
            });
        });
    });
    myStudyBtn.on('click',function(){
        $.mobile.loading('show');
        $.post(link_rank,"",function(data){
            if(data.status == 200){
                $.mobile.loading('hide');
                user_avatar.attr('src',data.data.avatar);
                nickname.html(data.data.nickname);
                rank_num.html(data.data.rank);
                day_num.html(data.data.groups);
            }else{
                alert(data.info);
            }
        });
        $.mobile.changePage('#overPage',{
            transition:'flow'
        });
    });
   $('.startBtn').on('click',function(){
       $.mobile.loading('show');
       var _data = {};
       _data.lession_id = 77;
       $.post(learned_link,_data,function(data){
           $.mobile.loading('hide');
           if(data.status == 200){
               aCourseNum.css('background-color','#f59a4e');
           }else if(data.status == 405){
               for(var i = 0 ; i < data.data ; i++){
                   aCourseNum.eq(i).css('background-color','#f59a4e');
               }
           }
           $.mobile.changePage('#backPage',{
               transition:'flow'
           });
       });
    });
    $('.Qc').on('click',function(){
        mask.css('display','block');
        developer_list.css('display','block');
    });
    close_developer.on('click',function(){
        mask.css('display','none');
        developer_list.css('display','none');
        warning.css('display','none');
        ps.css('display','none');
        if(over_flag){
            $.mobile.loading('show');
            var _data = {};
            _data.lession_id = 77;
            $.post(learned_link,_data,function(data){
                $.mobile.loading('hide');
                if(data.status == 200){
                    aCourseNum.css('background-color','#f59a4e');
                }else if(data.status == 405){
                    for(var i = 0 ; i < data.data ; i++){
                        aCourseNum.eq(i).css('background-color','#f59a4e');
                    }
                }
                $.mobile.changePage('#backPage',{
                    transition:'flow'
                });
            });
        }
    });
    $('.listBtn').on('click',function(){
        $.mobile.loading('show');
        $.post(link_rank,"",function(data){
            if(data.status == 200){
                $.mobile.loading('hide');
                user_avatar.attr('src',data.data.avatar);
                nickname.html(data.data.nickname);
                rank_num.html(data.data.rank);
                day_num.html(data.data.groups);
            }else{
                alert(data.info);
            }
        });
        var _data = {};
        _data.from = 1;
        _data.to = 50;
        $.mobile.loading('show');
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
    next_question.on('click',function(){
        if (nextFlag == 0){
            return false;
        }
        q_content.css('top',0);
        nextFlag = 0;
        console.log(current);
        if(current == 3){
            learn_completed.css('display','block');
            warning.css('display','block');
            mask.css('display','block');
            over_flag = 1;
            nextFlag = 1;
            return false;
        }
        clearInterval(timer);
        time_content.html(7+' s');
        timeNum = 7;
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
                console.log(data.error);
            }
        });
    });
    $('.ok').on('click',function(){
        time_content.html(7+' s');
        timeNum = 7;
        $.mobile.changePage('#beginPage',{
            transition:'flow'
        });
    });
});