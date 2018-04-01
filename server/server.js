const express = require('express');
const app = express();

var emptyTime = '--:--:--';

//cors
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

//data var
var playerList = {};

//problem set
var problemSetCollection = {
    'problem': [
        {
            "description": "Given n of 1 or more, return the factorial of n, which is n * (n-1) * (n-2) ... 1. Compute the result recursively (without loops).<br><br>Example: <br>factorial(1) → 1<br>factorial(2) → 2<br>factorial(3) → 6",
            "code": "function factorial(n){\n\treturn 0;\n}\n",
            'test': ['factorial(1)', 'factorial(2)', 'factorial(3)', 'factorial(4)', 'factorial(5)', 'factorial(6)', 'factorial(7)', 'factorial(8)', 'factorial(12)'],
            'solution': [1, 2, 6, 24, 120, 720, 5040, 40320, 479001600]
        },
        {
            "description": "The fibonacci sequence is a famous bit of mathematics, and it happens to have a recursive definition. The first two values in the sequence are 0 and 1 (essentially 2 base cases). Each subsequent value is the sum of the previous two values, so the whole sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21 and so on. Define a recursive fibonacci(n) method that returns the nth fibonacci number, with n=0 representing the start of the sequence. <br><br>Example: <br>fibonacci(0) → 0<br>fibonacci(1) → 1<br>fibonacci(2) → 1<br>fibonacci(4) → 3",
            "code": "function fibonacci(n){\n\treturn 0;\n}\n",
            'test': ['fibonacci(0)', 'fibonacci(1)', 'fibonacci(2)', 'fibonacci(3)', 'fibonacci(4)', 'fibonacci(5)', 'fibonacci(6)', 'fibonacci(7)', 'fibonacci(10)'],
            'solution': [0, 1, 1, 2, 3, 5, 8, 13, 55]
        },
        {
            "description": "Given a string, return true if 'bad' appears starting at index 0 or 1 in the string, such as with 'badxxx' or 'xbadxx' but not 'xxbadxx'. The string may be any length, including 0. <br><br>Example: <br>hasBad(\"badxx\") → true<br>hasBad(\"xbadxx\") → true<br>hasBad(\"xxbadxx\") → false",
            "code": "function hasBad(str){\n\treturn false;\n}\n",
            'test': ['hasBad("badxx")', 'hasBad("xbadxx")', 'hasBad("xxbadxx")', 'hasBad("code")', 'hasBad("bad")', 'hasBad("ba")', 'hasBad("xba")', 'hasBad("xbad") ', 'hasBad("")', 'hasBad("badyy")'],
            'solution': [true, true, false, false, true, false, false, true, false, true]
        },
        {
            "description": "We want make a package of goal kilos of chocolate. We have small bars (1 kilo each) and big bars (5 kilos each). Return the number of small bars to use, assuming we always use big bars before small bars. Return -1 if it can't be done. <br><br>Example: <br>makeChocolate(4, 1, 9) → 4 <br>makeChocolate(4, 1, 10) → -1 <br>makeChocolate(4, 1, 7) → 2",
            "code": "function makeChocolate(small, big, goal){\n\treturn -1;\n}\n",
            'test': ['makeChocolate(4, 1, 9)', 'makeChocolate(4, 1, 10)', 'makeChocolate(4, 1, 7)', 'makeChocolate(4, 1, 5)', 'makeChocolate(6, 1, 11)', 'makeChocolate(60, 100, 550)', 'makeChocolate(7, 1, 12)', 'makeChocolate(1, 2, 5)', 'makeChocolate(6, 1, 12)'],
            'solution': [4, -1, 2, 0, 6, 50, 7, 0, -1]
        },
        {
            "description": "Given an array of ints, is it possible to divide the ints into two groups, so that the sum of the two groups is the same, with these constraints: all the values that are multiple of 5 must be in one group, and all the values that are a multiple of 3 (and not a multiple of 5) must be in the other. (No loops needed.) <br><br> Example: <br>split53([1, 1]) → true <br>split53([1, 1, 1]) → false<br>split53([2, 4, 2]) → true",
            "code": "function split53(intarr){\n\treturn -1;\n}\n",
            'test': ['split53([1, 1])', 'split53([1, 1, 1])', 'split53([2, 4, 2])', 'split53([2, 2, 2, 1])', 'split53([3, 3, 5, 1])', 'split53([3, 5, 8])', 'split53([2, 4, 6])', 'split53([3, 5, 6, 10, 3, 3])'],
            'solution': [true, false, true, false, true, false, true, true]
        }
    ]
};
var problemSet = problemSetCollection['problem'][0];

//print playerList every time api call made and 
app.get('/', function(req, res){
    console.log(JSON.stringify(playerList, null, 2));
    console.log("\n\n================================\n\n\n\n");
    parseUserAction(req, res);
});

function parseUserAction(req, res){
    var userAction = req.query.getInfo;
    switch(userAction){
        case 'host':
            createHost(req, res);
            break;
        case 'addPlayer':
             addPlayer(req, res);
            break;
        case 'start':
            startGame(req, res);
            break;
        case 'complete':
            finishedGame(req, res);
            break;
        case 'clearservers':
            playerList = {};
            break;
        case 'newproblem':
            resetGame(req, res);
            break;
        default:
            res.send(playerList[req.query.gamelink]['gameDetails']);
            break;
    }
}
function resetGame(req, res){
    var problemNum = playerList[req.query.gamelink]['gameDetails'][5]['problemNum'];
    problemNum += 1;
    playerList[req.query.gamelink]['gameDetails'][5]['problemNum'] = problemNum;
    problemSet = problemSetCollection['problem'][problemNum];
    playerList[req.query.gamelink]['gameDetails'][4] = problemSet;
    playerList[req.query.gamelink]['gameDetails'][2]['completionTime'].fill(emptyTime);
}
function createHost(req, res){
    var randomString = makeid();
    var gameData = {
            "gameDetails": [{
                "gameID": randomString
            },
                            {
                "players":[req.query.playerName]
            },
            {
                "completionTime": [emptyTime]
            },
            {
                "start": false
            }]
        };
    
    playerList[randomString] = gameData;
    res.send(playerList[randomString]['gameDetails']);
}
function addPlayer(req, res){
    playerList[req.query.gamelink]['gameDetails'][1]['players'].push(req.query.playerName);
    playerList[req.query.gamelink]['gameDetails'][2]['completionTime'].push(emptyTime);
    res.send(playerList[req.query.gamelink]['gameDetails']);
}
function startGame(req, res){
    playerList[req.query.gamelink]['gameDetails'][3]['start'] = true;
    problemSet = problemSetCollection['problem'][2];
    playerList[req.query.gamelink]['gameDetails'].push(problemSet);
    playerList[req.query.gamelink]['gameDetails'].push({'problemNum': 0});
    res.send(playerList[req.query.gamelink]['gameDetails']);
}
function finishedGame(req, res){
    playerList[req.query.gamelink]['gameDetails'][3]['start'] = false;
    for(let i = 0; i < playerList[req.query.gamelink]['gameDetails'][1]['players'].length; i++){
        if(playerList[req.query.gamelink]['gameDetails'][1]['players'][i] == req.query.playerName){
            console.log(playerList[req.query.gamelink]['gameDetails'][1]['players'][i], req.query.playerName);
            playerList[req.query.gamelink]['gameDetails'][2]['completionTime'][i] = req.query.completedTime;
        }
    }
    res.send(playerList[req.query.gamelink]['gameDetails']);
}
function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Code Challenge running at http://${host}:${port}`);
});