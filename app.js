var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var jsonParser = bodyParser.json();

var repeaterBuffer = new Array();                   //QQ id of repeaters
var repeatMsg = 'repeatMsg';                        //Message being repeated
var repeatTime = 0;                                 //Repeat times

var executeBorder = 5;                              //Limition of performing a ban
var executeTime = 60;                               //Ban time (second)
var monitorGroup = 123456;                          

var mode = 2;

function sendMessage(account, message)
{
    var postData = {
        "account": account,
        "msg": message
    };

    var req = http.request(
        {
            host: '127.0.0.1',
            port: '36524',
            method: 'POST',
            path: '/api/v1/Cqp/CQ_sendPrivateMsg',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    req.write(JSON.stringify(postData));
    req.end();
}

//Perform a ban to a group member with mahua api
function sendRequest(group, account, time)
{
    var postData = {
        "群号": group,
        "account": account,
        "禁言时间": time
    };

    var req = http.request(
        {
            host: '127.0.0.1',
            port: '36524',
            method: 'POST',
            path: '/api/v1/Cqp/CQ_setGroupBan',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    req.write(JSON.stringify(postData));
    req.end();
}

//Main function of execution
function execute(mode) {
    switch (mode) {

        //Normal mode: Ban the last repeater
        case 1: {
            sendRequest(monitorGroup, repeaterBuffer.pop(), executeTime);
            
            break;
        }
        
        //Random mode: Ban a repeater randomly
        case 2: {
            for (var i = 0; i<repeaterBuffer.length; i++) {
                console.log(repeaterBuffer[i]);
            }
            var index = Math.floor(Math.random()*(repeaterBuffer.length));
            sendRequest(monitorGroup, repeaterBuffer[index], executeTime);
            console.log("\n"+repeaterBuffer[index]);

            break;
        }
        
        //Force mode: Ban all repeaters
        case 3: {
            var i = 0;
            for(i = 0; i<repeaterBuffer.length; i++) {
                sendRequest(monitorGroup, repeaterBuffer.pop(), executeTime);
            }
            
            break;
        }

        default:
            break;
    }
}

app.get('/', function(req, res) {
    res.send('aaa');
});

//Triggered when receive message from group
app.post('/api/ReceiveMahuaOutput', jsonParser, function (req, res) {
    //Get api JSON output
    var data = req.body;

    if(data.SubType == 1) {
        console.log("match\n");
        //Occured break while repeating
        if(data.Message!=repeatMsg) {
            repeatTime=1;
            repeatMsg=data.Message;
            repeaterBuffer = [];
            monitorGroup = data.FromGroup;
        }
        
        else {
            repeatTime++;
            repeaterBuffer.push(data.FromQQ);
        }
    }

    if(data.SubType == 11) {
        console.log("Settings\n");
        switch (data.Msg) {
            case '普通模式' : {
                mode = 1;
                sendMessage(data.FromQQ, '已切换至普通模式');
                break;
            }
            case '轮盘赌' : {
                mode = 2;
                sendMessage(data.FromQQ, '已切换至轮盘赌模式');
                break;
            }
            case '强力模式' : {
                mode = 3;
                sendMessage(data.FromQQ, '已切换至强力模式');
                break;
            }
            case '运行状态' : {
                sendMessage(data.FromQQ, 'mode = '+mode+'\n'+
                                         '检测次数 '+executeBorder+'\n'+
                                         '禁言时间 '+executeTime+' 秒');
                //sendMessage(data.FromQQ, '检测次数 '+executeBorder);
                //sendMessage(data.FromQQ, '禁言时间 '+executeTime+' 秒');
                break;
            }
            default : {
                if(data.Msg>60) {
                    executeTime = data.Msg;
                    sendMessage(data.FromQQ, '禁言时间已调整为 '+executeTime+' 秒');
                }
                else if(data.Msg<10){
                    executeBorder = data.Msg;
                    sendMessage(data.FromQQ, '检测次数已调整为 '+executeBorder+' 次');
                }
                else {
                    sendMessage(data.FromQQ, '不是合法的指令！\n'+
                                             '输入 普通模式/轮盘赌/强力模式 调整工作模式\n'+
                                             '输入小于10的整数调整检测次数\n'+
                                             '输入大于60的整数调整禁言时间\n'+
                                             '输入 运行状态 查看参数设置请况');
                    //sendMessage(data.FromQQ, '输入 普通模式/轮盘赌/强力模式 调整工作模式');
                    //sendMessage(data.FromQQ, '输入小于10的整数调整检测次数');
                    //sendMessage(data.FromQQ, '输入大于60的整数调整禁言时间');
                    //sendMessage(data.FromQQ, '输入 运行状态 查看参数设置请况');
                }
                break;
            }
        }
    }

    //Execute repeater(s)
    if(repeatTime==executeBorder){
        execute(mode);

        repeaterBuffer = [];
        repeatTime = 0;
    }
    
    console.log("%s", data);
});

var server = app.listen(65321, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server started at %s:%s", host, port);
});