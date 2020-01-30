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
            var index = Math.floor(Math.random()*(repeaterBuffer.length));
            sendRequest(monitorGroup, repeaterBuffer[index], executeTime);
            console.log(index);

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