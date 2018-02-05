<?php

session_start();

/**
 * 生成验证码
 * @param int $_code_length 长度
 * @param int $_width 宽度
 * @param int $_height 高度
 */
function _code($_code_length = 4, $_width = 100, $_height = 46){
    $_nmsg = '';
    for($i=0;$i<$_code_length;$i++){
        $_nmsg .= dechex(mt_rand(0,15));
    }
    $_SESSION["code"] = $_nmsg;

    $_img = imagecreatetruecolor($_width, $_height);

    $_white = imagecolorallocate($_img, 250, 250, 250);

    imagefill($_img, 0, 0, $_white);

    $_gray = imagecolorallocate($_img, 196, 196, 196);

    imagerectangle($_img, 0, 0, $_width-1, $_height-1, $_gray);

    ///绘制雪花点
    for($i=0;$i<2000;$i++){
        //设置点的颜色，50-200颜色比数字浅，不干扰阅读
        $pointcolor = imagecolorallocate($_img,rand(50,200), rand(50,200), rand(50,200));
        //imagesetpixel — 画一个单一像素
        imagesetpixel($_img, mt_rand(1,$_width), mt_rand(1,$_height), $pointcolor);
    }

    //绘制随机线条
    for ($i=0; $i < 32; $i++) {
        $_md_color = imagecolorallocate($_img, mt_rand(80,220), mt_rand(80,220), mt_rand(80,220));
        imageline($_img, mt_rand(0,$_width), mt_rand(0, $_height),mt_rand(0,$_width), mt_rand(0, $_height), $_md_color);
    }

    // for ($i=0; $i < 50; $i++) {
    //     $_md_color = imagecolorallocate($_img, mt_rand(200,255), mt_rand(200,255), mt_rand(200,255));
    //     imagestring($_img, 1, mt_rand(1,$_width-5), mt_rand(1, $_height-5), "*", $_md_color);
    // }

    $font ='/Library/Fonts/Songti.ttc';
    //绘制验证码
    $_w = $_width/$_code_length;
    for ($i=0; $i < $_code_length ; $i++) {
        $_md_color = imagecolorallocate($_img, mt_rand(0,102), mt_rand(0,102), mt_rand(0,102));
        $pix = 0;
        if($i==0){
            $pix = $_w*0.1;
        }
        elseif ($i==$_code_length-1){
            $pix = -($_w*0.1);
        }
        imagettftext($_img,28,mt_rand(-30,30),
            $i * $_w+mt_rand(1,5)+$pix,$_height / 1.4,$_md_color,$font,$_SESSION["code"][$i]);
        // imagestring($_img, 9, $i * $_width/$_code_length+ mt_rand(1, 10), mt_rand(1, $_height/2), $_SESSION["code"][$i], $_md_color);
        // imagettftext($_img,26,30,$i * $_width/$_code_length+ mt_rand(1, 10), mt_rand(1, $_height/2),$_md_color,$font,$_SESSION["code"][$i]);
    }

    header("Content-Type:image/png");

    imagepng($_img);

    imagedestroy($_img);
}
_code(4);