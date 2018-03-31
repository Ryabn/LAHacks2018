var baseCode;
var codeMirror;
var timer, updatePlayers;
var xhr = new XMLHttpRequest();
var url = "http://localhost:8080/";
//var url = 'https://code-challenge-199714.appspot.com';
var gamelink = 'w3cx89p', playerName = 'guest', ishost = false;
var problemSet = {}, playerList;
var allCorrect = true;

function enterRoom(){
    gamelink = document.getElementById('game-code').value;
    playerName = document.getElementById('user-name').value;
    console.log(gamelink);
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                updateWaitingRoom();
            }
        }
    };
    if(gamelink == "host"){
        xhr.open("GET", url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=host", true);
        xhr.send();
        gamelink = 'w3cx89p';
        ishost = true;
    }else{
        xhr.open("GET", url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=addPlayer", true);
        xhr.send();
    }
}
function updateWaitingRoom(){
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('waiting-room').style.display = 'block';
    if(!ishost){
        document.getElementById('hostbutton').style.backgroundColor = 'grey';
        document.getElementById('ishostbutton').innerHTML = 'Waiting for host...';
    }
    updatePlayers = setInterval(function(){
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    var players = JSON.parse(xhr.responseText);
                    displayWaitingRoom(players);
                }
            }
        };
        xhr.open("GET", url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=players", true);
        xhr.send();
    }, 500);
}
function displayWaitingRoom(players){
    if(players[gamelink]["gameDetails"][2]["start"]){
        problemSet = players[gamelink]['gameDetails'][3];
        playerList = players;
        start();
    }else{
        document.getElementById('waiting-room-display').innerHTML = "";
        for(i = 0; i < players[gamelink]['gameDetails'][0]['players'].length; i++){
            document.getElementById('waiting-room-display').innerHTML += '<div class="guestNames">' + players[gamelink]['gameDetails'][0]['players'][i] + '</div>';
        }
    }
}
function enterGame(){
    if(ishost){
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    var players = JSON.parse(xhr.responseText);
                    displayWaitingRoom(players);
                }
            }
        };
        xhr.open("GET", url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=start", true);
        xhr.send();
    }
}
function start(){
    document.getElementById('waiting-room').style.display = 'none';
    clearInterval(updatePlayers);
    parseProblemData();
    startTimer();
    updatePlayers = setInterval(function(){
        updateScoreboard();
    }, 1000);
}
function startTimer(){
    var date = Date.now();
    timer = setInterval(function(){
        displayTime(date);
    }, 10);
}
function displayTime(date){
    var timeElapsed = Date.now() - date;
    var minutes = parseInt(timeElapsed/60000);
    timeElapsed %= 60000;
    var seconds = parseInt(timeElapsed/1000);
    timeElapsed %= 1000;
    var milliseconds = parseInt(timeElapsed/10);
    document.getElementById('time').innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds) + ":" + (milliseconds < 10 ? '0' + milliseconds : milliseconds);
}
function parseProblemData(){
    var problemString = problemSet['description'];
    displayProblem("Challenge: " + problemString);
    baseCode = problemSet['code'];
    createCodeEditor();
}
function createCodeEditor(){
    codeMirror = CodeMirror(document.getElementById('code-editor'), {
        value: baseCode,
        mode:  "javascript",
        theme: "base16-dark",
        lineNumbers: true
    });
}
function displayProblem(problemString){
    document.getElementById('problem-description').innerHTML = problemString;
}
function submitCode(){
    allCorrect = true;
    document.getElementById('output').innerHTML = '';
    var userSubmission = codeMirror.getValue();
    
    for(i = 0; i < problemSet['test'].length; i++){
        var submissionTest =  userSubmission + problemSet['test'][i];
        var userOutput = eval(submissionTest);
        checkUserSubmission(userOutput, i, problemSet['test'][i]);
    }
    if(allCorrect){
        correctSolution();
    }
}
function checkUserSubmission(userOutput, testNum, userInput){
    if(userOutput == problemSet['solution'][testNum]){
        setCorrect(userInput, userOutput);
    }else{
        setIncorrect(userInput, userOutput);
        allCorrect = false;
    }
}
function setCorrect(userInput, userOutput){
    var result = '<div class="resultOutput success">' + userInput + " -> " + userOutput  + '</div>';
    document.getElementById('output').innerHTML += result;
}
function setIncorrect(userInput, userOutput){
    var result = '<div class="resultOutput fail">' + userInput + " -> " + userOutput + '</div>';
    document.getElementById('output').innerHTML += result;
}
function correctSolution(){
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                playerList = JSON.parse(xhr.responseText);
                updateScoreboard();
            }
        }
    };
    xhr.open("GET", url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=complete" + "&completedTime=" + document.getElementById('time').innerHTML, true);
    xhr.send();
    clearInterval(timer);
    updateScoreboard();
    clearInterval(updatePlayers);
}
function updateScoreboard(){
    
    document.getElementById('scoreboard').innerHTML = '<div class="scoreboard-title"> Scoreboard </div>';
    for(i = 0; i < playerList[gamelink]['gameDetails'][0]['players'].length; i++){
        document.getElementById('scoreboard').innerHTML += '<div class="scoreboard-names">' + playerList[gamelink]['gameDetails'][0]['players'][i] + '</div>';
        
        document.getElementById('scoreboard').innerHTML += '<div class="scoreboard-times">' + playerList[gamelink]['gameDetails'][1]['completionTime'][i] + '</div>';
    }
}