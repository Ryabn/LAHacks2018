const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var playerList = {};
var problemSet = {
    "description": "Given n of 1 or more, return the factorial of n, which is n * (n-1) * (n-2) ... 1. Compute the result recursively (without loops).",
    "code": "function factorial(intNum){\n\treturn 100;\n}\n",
    'test': ['factorial(1)', 'factorial(2)', 'factorial(3)', 'factorial(4)', 'factorial(5)', 'factorial(6)', 'factorial(7)', 'factorial(8)', 'factorial(12)'],
    'solution': [1, 2, 6, 24, 120, 720, 5040, 40320, 479001600]
}
app.get('/', function(req, res){
    console.log(JSON.stringify(playerList));
    parseUserAction(req, res);
});

function parseUserAction(req, res){
    var emptyTime = '--:--:--';
    if(req.query.getInfo == 'host'){
        var gameData = {
            "gameDetails": [{
                "players":[req.query.playerName]
            },
            {
                "completionTime": [emptyTime]
            },
            {
                "start": false
            }]
        };
        var randomString = '123123';
        playerList[randomString] = gameData;
    }else if(req.query.getInfo == 'addPlayer'){
        playerList[req.query.gamelink]['gameDetails'][0]['players'].push(req.query.playerName);
        playerList[req.query.gamelink]['gameDetails'][1]['completionTime'].push(emptyTime);
    }else if(req.query.getInfo == 'players'){
        console.log(playerList[req.query.gamelink]['gameDetails'][0]['players']);
    }else if(req.query.getInfo == 'start'){
        playerList[req.query.gamelink]['gameDetails'][2]['start'] = true;
        playerList[req.query.gamelink]['gameDetails'].push(problemSet);
    }else if(req.query.getInfo == 'complete'){
        for(i = 0; i <  playerList[req.query.gamelink]['gameDetails'][0]['players'].length; i++){
            if(playerList[req.query.gamelink]['gameDetails'][0]['players'][i] == req.query.playerName){
                playerList[req.query.gamelink]['gameDetails'][1]['completionTime'][i] = req.query.completedTime;
            }
        }
    }
    res.send(playerList);
}

const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Example app listening at http://${host}:${port}`);
});