<?php
namespace Home\Controller;
use Org\Util\String;
use Think\Model;

class IndexController extends BaseController {
    private $appid = 'wx81a4a4b77ec98ff4';
    private $acess_token = 'gh_68f0a1ffc303';
    public function index(){
        $userCurrent = M('user_current_question');
        $openid = session('openid');
        $currentData = $userCurrent->where(array('openid' => $openid))->find();
        $share = '快来参加 “团团打卡 学讲话” 特训，天天打卡，做合格共青团员';
        if ($currentData['date'] == date('Y-m-d', time()) && $currentData['today_group_count'] != 0){
            $users = M('users');
            $user = $users->where(array('openid' => $openid))->find();
            $map['score'] = array('GT', $user['score']);
            $rank = $users->where($map)->count();
            $rank += 1;
            if ($rank <= 50) {
                $real = $users->order('score desc')->field('nickname, imgurl, score')->limit(50)->select();
                foreach ($real as $key => $value) {
                    if ($value['nickname'] == $user['nickname']) {
                        $rank = $key+1;
                    }
                }
            }
            $share = '我正在参加 “团团打卡 学讲话” 特训，打卡第'.$user['days'].'天，排第'.$rank.'名，明天继续！你也加入吧！';
        }
//        $signature = $this->JSSDKSignature();
//        $this->assign('signature', $signature);
        $this->assign('appid', $this->appid);
        $this->assign('share', $share);
        $this->display();
    }

    public function lessonList() {
        $questions = M('questions');
        $idList = $questions->field('id')->select();
        $data = array();
        $num = 1;
        foreach ($idList as $v) {
            if ($v['id'] % 3 == 1) {
                array_push($data, array(
                    'id' => $num,
                    'lesson_id' => $v['id']
                ));
                $num += 1;
            }
        }
        $this->ajaxReturn(array(
            'status' => 200,
            'data'  => $data
        ));
    }

    public function questions() {
//        $isNew = I('post.new') == 'true' ? true : false;
        $lesson_id = I('post.lesson_id', 0);
        $lesson_id = $lesson_id == 0 ? 0 : ($lesson_id - 1) * 3 + 1;
        $openid = session('openid');
        $questions = M('questions');
        $userCurrent = M('user_current_question');
        $currentData = $userCurrent->where(array('openid' => $openid))->find();
        //访问时检查是否为第二天, 重置状态
        if ($currentData['date'] != date('Y-m-d', time())) {
            $currentData['date'] = date('Y-m-d', time());
            $currentData['time'] = 0;
            $currentData['current'] = 0;
            $currentData['today_group_count'] = 0;
//            $currentData['today_learn_id'] = json_encode(array());
        }

        //检查学习题目上限
        if ($currentData['today_group_count'] == 2) {
            $this->ajaxReturn(array(
                'status' => 403,
                'error'  => '每天最多只能学两组课程'
            ));
        }

        //请求新题目时检查时间是否满足
        if (time() - $currentData['time'] < 1) {
            $this->ajaxReturn(array(
                'status' => 403,
                'error'   => '学习时间未满'
            ));
        }

        $currentData['today_learn_id'] = json_decode($currentData['today_learn_id']);

        //检查是否依次学习, 可以学习学过的
        if (!$this->isIdLearn($lesson_id, $currentData['today_learn_id'])) {
            if ($lesson_id != 0 && count($currentData['today_learn_id']) > 0) {
                $lastId = $currentData['today_learn_id'][count($currentData['today_learn_id']) - 1];
                $can = false;
                if ($lesson_id == $lastId + 1) {
                    $can = true;
                }
                if (!$can) {
                    $lesson_id = ($lastId - $lastId % 3) / 3 + 1;
                    $this->ajaxReturn(array(
                        'status' => 403,
                        'data' => $lesson_id,
                        'error' => '您不能学习该课程'
                    ));
                }
            }
        }


        if ($lesson_id != 0) {
            $currentData['question_id'] = $lesson_id;
            $question = $questions->where(array('id' => $lesson_id))->find();
        } else {
            $currentData['question_id'] = $currentData['question_id'] + 1;
            $question = $questions->where(array('id' => $currentData['question_id']))->find();
        }
        //检查学习次数, 并给出分数系数和是否加入today_learn_id, 杨老板这个价格不值得我优化, 优化思路很简单, 设计一个存储lesson_id和次数的数据结构
        $num = $this->checkLearnTimes($question['id'], $currentData['today_learn_id']);
        if ($num < 2) {
            array_push($currentData['today_learn_id'], $question['id']);
        }
        $k = 2 - $num < 0 ? 0 : 2 - $num;
        $k = $k/2;

        $currentData['today_learn_id'] = json_encode($currentData['today_learn_id']);
        $currentData['current'] += 1;
        $current = $currentData['current'];
        if ($currentData['question_id'] != null && $currentData['question_id'] % 3 == 0 ) {
            $currentData['current'] = 0;
            if ($num == 0) {
                $currentData['today_group_count'] += 1;
            }
            $users = M('users');
            $user = $users->where(array('openid' => $openid))->find();
            $user['score'] += $k*30;
            if ($currentData['today_group_count'] == 2) {
                $user['days'] += 1;
                $user['score'] += 70;
                //costtime作为时间, 时间越大排越后面
                $spend = time() % (3600*24);
                $user['costtime'] += $spend;
            }
            $user['count'] += 1;
            $users->where(array('openid' => $openid))->save($user);
        }
        $currentData['time'] = time();
//        $currentData['question_id'] = $question['id'];
        $userCurrent->where(array('openid' => $openid))->save($currentData);
        $this->ajaxReturn(array(
            'status' => 200,
            'data'   => array(
                'question' => $question,
                'current'  => $current
            )
        ));
    }

    public function rank() {
        $users = M('users');
        $openid = session('openid');
        $user = $users->where(array('openid' => $openid))->find();
        $map['score'] = array('GT', $user['score']);
        $model = new Model();
        $row = $model->query("select * from (select *, (@rank := @rank + 1)rank from (select openid from users order by socore desc, costtime asc)t, (select @rank := 0)a)b WHERE openid='$openid'");
        $rank = $row[0]['rank'];
//        $list = $users->order('score desc')->field('nickname, imgurl, score')->limit(10)->select();
//        if ($rank <= 50) {
//            $real = $users->order('score desc')->field('nickname, imgurl, score')->limit(50)->select();
//        }
//        foreach ($real as $key => $value) {
//            if ($value['nickname'] == $user['nickname']) {
//                $rank = $key+1;
//            }
//        }
        if ($user['days'] == 0) {
            $rank = '∞';
        }
        $this->ajaxReturn(array(
            'status' => 200,
            'data'   => array(
                'rank' => $rank,
                'nickname' => $user['nickname'],
                'avatar' => $user['imgurl'],
                'days' => $user['days'],
                'groups' => $user['count']
            )
        ));
    }

    public function moreRank() {
        $from = I('post.from');
        $to = I('post.to');
        if (!is_numeric($from) || !is_numeric($to) || $to < $from) {
            $this->ajaxReturn(array(
                'status' => 403,
                'error'  => '参数错误'
            ));
        }
        $offset = $from - 1 >= 0 ? $from - 1:0;
        $limit = $to - $offset;
        $users = M('users');
        $list = $users->order('score desc, costtime asc')->field('nickname, imgurl, score')->limit($offset, $limit)->select();
        $rank = $from;
        foreach ($list as &$v) {
            unset($v['score']);
            $v['rank'] = $rank;
            $rank++;
        }
        $this->ajaxReturn(array(
            'status' => 200,
            'data'  => $list
        ));
    }

    public function JSSDKSignature(){
        $string = new String();
        $jsapi_ticket =  $this->getTicket();
        $data['jsapi_ticket'] = $jsapi_ticket['data'];
        $data['noncestr'] = $string->randString();
        $data['timestamp'] = time();
        $data['url'] = 'https://'.$_SERVER['HTTP_HOST'].__SELF__;//生成当前页面url
        $data['signature'] = sha1($this->ToUrlParams($data));
        return $data;
    }
    private function ToUrlParams($urlObj){
        $buff = "";
        foreach ($urlObj as $k => $v) {
            if($k != "signature") {
                $buff .= $k . "=" . $v . "&";
            }
        }
        $buff = trim($buff, "&");
        return $buff;
    }


    /*curl通用函数*/
    private function curl_api($url, $data=''){
        // 初始化一个curl对象
        $ch = curl_init();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
        // 运行curl，获取网页。
        $contents = json_decode(curl_exec($ch), true);
        // 关闭请求
        curl_close($ch);
        return $contents;
    }

    private function getTicket() {
        $time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $string='';
        for($i=0;$i<16;$i++){
            $num = mt_rand(0,61);
            $string .= $str[$num];
        }
        $secret =sha1(sha1($time).md5($string)."redrock");
        $t2 = array(
            'timestamp'=>$time,
            'string'=>$string,
            'secret'=>$secret,
            'token'=>$this->acess_token,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket";
        return $this->curl_api($url, $t2);
    }

    private function isIdLearn($id, $arr) {
        foreach ($arr as $v) {
            if ($id == $v) {
                return true;
            }
        }
        return false;
    }
    private function checkLearnTimes($id, $arr) {
        $num = 0;
        foreach ($arr as $v) {
            if ($id == $v) {
                $num++;
            }
        }
        return $num;
    }

    private function delId($id, $arr) {
        foreach ($arr as &$v) {
            if ($id == $v) {
                unset($v);
            }
        }
        return $arr;
    }

    public function addtestdata(){
        $string = new String();
        $users = M('users');
        $ucq = M('user_current_question');
        for ($i=0;$i<120;$i++) {
            $openid = $string->randString();
            $score = rand(0, 100);
            $day = rand(0, 100);
            $data1 = array(
                'openid' => $openid,
                'nickname' => '周老板'.$day,
                'score' => $score,
                'days' => $day
            );
            $data2 = array(
                'openid' => $openid
            );
            $users->add($data1);
            $ucq->add($data2);
        }
    }
}
