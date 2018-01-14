<?php
session_start();
$captchaCode = $_SESSION["code"];


//rsa 私钥
$private_key='-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQCaa9HnhyNTF1O8ChMmPPKZC8NFSCw+didy6Rf/nTBdzF/y/wvg
z9CVfDjmatetmj3zLaFiyWjHCYw6f7e+TKGKCSq92qVGIFkCIhWoMcPPigrV8x75
OjzZnfvfJsoOyllh7GqCJYAVLBq37wyWjOEXmJ41yHUv10e+562YP000KQIDAQAB
AoGBAJlPtqRxbMbQABhOwFhUZl9AaGxejV6uG9hgR61GOIDHqfMs+HQInwPqwusw
5FS9MAhBI1tar6X8eraRmrFaj31bXyDqaPYJ102AZAW8HJZrpRUq1wxbJoVwwUsU
xHEZUoUsbzu/sAhXyoNn+YzLqfXiGPQ16hiP95IF6DjP3wzJAkEAyt+rv/YFvj/A
b8VgdPeBKNg6a4cFZjRog8iNK85U9pZPvnMxaFqdyCDrt1nrzy5n/vdZ18cSWrfX
y/aPM+UcTwJBAMLb99bs+UC0m5Geu6V3JX/pfnxZFzjQl/pMA3rM3e5II/22UTkd
SFXC2CEULwFQEP5m/mEKF+Aysf65kPjeMgcCQA9Wp+qklDyVH1yUBL3zNJ2883XL
yJm4nqpQEHRebkgSh0bz+KlWKJXH/2pmbxDEBnLdirpov7eCLNur8ZnP2bsCQQCA
rJsb3T63IMy+O3C0Ulp7/iddW8N+7Bf/2+RMWi6PZCoIJzW5noGeyFzKczabClE+
faqrT+v2S+PITqfR/4BPAkEAlGdj+t2h0yGn7zSWaGV9vNHjWn0SYg+Bzu/T625L
wierwzzAWMhCurj1qGnXRnbA4tKTNJ7y0hR2uvPtdpBw+g==
-----END RSA PRIVATE KEY-----';

/*
 1.生成私钥:openssl genrsa -out rsa_1024_priv.pem 1024
 2.生成公钥:openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
 */

//私钥解密
openssl_private_decrypt(base64_decode($_POST['d']),$decrypted,$private_key);

$arr = json_decode($decrypted);

//sleep(2);

$result = [
    'success' => true,
    'message' => '账号密码错误',
    'url' => 'index.html',
    'code' => $captchaCode,
    'captcha' => 1,
    'pass'=> $arr->password
];

//if ($_POST['captcha'] !== $captchaCode) {
//    $result['success'] = false;
//    $result['message'] = '验证码错误';
//}

echo json_encode($result);