const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var problemSetCollection = {
    'problem': [
        {
            "description": "Given n of 1 or more, return the factorial of n, which is n * (n-1) * (n-2) ... 1. Compute the result recursively (without loops).",
            "code": "function factorial(n){\n\treturn 0;\n}\n",
            'test': ['factorial(1)', 'factorial(2)', 'factorial(3)', 'factorial(4)', 'factorial(5)', 'factorial(6)', 'factorial(7)', 'factorial(8)', 'factorial(12)'],
            'solution': [1, 2, 6, 24, 120, 720, 5040, 40320, 479001600]
        },
        {
            "description": "We have a number of bunnies and each bunny has two big floppy ears. We want to compute the total number of ears across all the bunnies recursively (without loops or multiplication).",
            "code": "function bunnyEars(bunnies){\n\treturn 100;\n}\n",
            'test': ['bunnyEars(0)', 'bunnyEars(1)', 'bunnyEars(2)', 'bunnyEars(3)', 'bunnyEars(4)', 'bunnyEars(5)', 'bunnyEars(12)', 'bunnyEars(50)', 'bunnyEars(234)'],
            'solution': [0, 2, 4, 6, 8, 10, 24, 100, 468]
        },
        {
            "description": "The fibonacci sequence is a famous bit of mathematics, and it happens to have a recursive definition. The first two values in the sequence are 0 and 1 (essentially 2 base cases). Each subsequent value is the sum of the previous two values, so the whole sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21 and so on. Define a recursive fibonacci(n) method that returns the nth fibonacci number, with n=0 representing the start of the sequence.",
            "code": "function fibonacci(n){\n\treturn 0;\n}\n",
            'test': ['fibonacci(0)', 'fibonacci(1)', 'fibonacci(2)', 'fibonacci(3)', 'fibonacci(4)', 'fibonacci(5)', 'fibonacci(6)', 'fibonacci(7)', 'fibonacci(10)'],
            'solution': [0, 1, 1, 2, 3, 5, 8, 13, 55]
        },
        {
            "description": "Given n of 1 or more, return the factorial of n, which is n * (n-1) * (n-2) ... 1. Compute the result recursively (without loops).",
            "code": "function factorial(intNum){\n\treturn 100;\n}\n",
            'test': ['factorial(1)', 'factorial(2)', 'factorial(3)', 'factorial(4)', 'factorial(5)', 'factorial(6)', 'factorial(7)', 'factorial(8)', 'factorial(12)'],
            'solution': [1, 2, 6, 24, 120, 720, 5040, 40320, 479001600]
        }
    ]
};

var playerList = {};
var problemSet = problemSetCollection['problem'][2];

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
        var randomString = 'w3cx89p';
        playerList[randomString] = gameData;
    }else if(req.query.getInfo == 'addPlayer'){
        playerList[req.query.gamelink]['gameDetails'][0]['players'].push(req.query.playerName);
        playerList[req.query.gamelink]['gameDetails'][1]['completionTime'].push(emptyTime);
    }else if(req.query.getInfo == 'players'){
        console.log(playerList[req.query.gamelink]['gameDetails'][0]['players']);
    }else if(req.query.getInfo == 'start'){
        playerList[req.query.gamelink]['gameDetails'][2]['start'] = true;
        var randNum = Math.floor(Math.random() * 3);
        problemSet = problemSetCollection['problem'][randNum];
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