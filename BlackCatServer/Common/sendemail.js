/**
 * Created by li on 2015/10/29.
 */

var nodemailer = require("nodemailer");

// ����һ�� SMTP ���ӳ�
var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.qq.com", // ����
    secureConnection: true, // ʹ�� SSL
    port: 465, // SMTP �˿�
    auth: {
        user: "337605876@qq.com", // �˺�
        pass: "kjxh_lyf" // ����
    }
});

// �����ʼ�����
var mailOptions = {
    from: "Fred Foo <3376059876qq.com>", // ������ַ
    to: "337605876@qq.com", // �ռ��б�
    subject: "Hello world", // ����
    html: "<b>thanks a for visiting!</b> ���磬��ã�" // html ����
}

// �����ʼ�
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    smtpTransport.close(); // ���û�ã��ر����ӳ�
});
