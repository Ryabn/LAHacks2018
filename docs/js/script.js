var baseCode;
var codeMirror;
var timer, updatePlayers;
var xhr = new XMLHttpRequest();
var url = "http://localhost:8080/";
//var url = 'https://code-challenge-199714.appspot.com';
var gamelink, playerName = 'guest', ishost = false;
var problemSet = {}, playerList, created = false;
var allCorrect = true;

function makeAPICall(APICall, responseFunction){
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                responseFunction(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.open("GET", APICall, true);
    xhr.send();
}
function enterRoom(){
    gamelink = document.getElementById('game-code').value;
    playerName = document.getElementById('user-name').value;
    var serverCall;
    if(gamelink == "host"){
        serverCall = url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=host";
        ishost = true;
    }else if(gamelink == "clearAllGames"){
        serverCall = url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=clearservers";
    }else{
        serverCall = url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=addPlayer";
    }
    makeAPICall(serverCall, enterRoomResponse);
   
}
function enterRoomResponse(serverResp){
    if(ishost){
        gamelink = serverResp[0]['gameID'];
    }
    console.log(serverResp);
    updateWaitingRoom();
}
function updateWaitingRoom(){
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('waiting-room').style.display = 'block';
    if(!ishost){
        document.getElementById('hostbutton').style.backgroundColor = 'grey';
        document.getElementById('ishostbutton').innerHTML = 'Waiting for host...';
    }
    updatePlayers = setInterval(function(){
        var serverCall = url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=players";
        makeAPICall(serverCall, displayWaitingRoom);
    }, 1000);
}
function displayWaitingRoom(serverResp){
    if(serverResp[3]['start']){
        clearInterval(updatePlayers);
        problemSet = serverResp[5]['problem'];
        playerList = serverResp;
        start();
    }else{
        document.getElementById('waiting-room-display').innerHTML = '<div class="guestNames" style="text-align:center; color: #1f0068"> The game code is: ' + serverResp[0]['gameID'] + '</div>';
        for(i = 0; i < serverResp[1]['players'].length; i++){
            document.getElementById('waiting-room-display').innerHTML += '<div class="guestNames">' + serverResp[1]['players'][i] + '</div>';
        }
    }
}
function enterGame(){
    if(ishost){
        var APICall = url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=start";
        makeAPICall(APICall, displayWaitingRoom);
    }
}
function start(){
    document.getElementById('waiting-room').style.display = 'none';
    parseProblemData();
    startTimer();
    setUpdateTimer();
}
function setUpdateTimer(){
    updatePlayers = setInterval(function(){
        updateScoreboard();
    }, 1250);
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
    if(!created){
        codeMirror = CodeMirror(document.getElementById('code-editor'), {
            value: baseCode,
            mode:  "javascript",
            theme: "base16-dark",
            lineNumbers: true
        });
        created = true;
    }else{
        codeMirror.setValue(baseCode);
    }
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
    clearInterval(timer);
    clearInterval(updatePlayers);
    var APICall =  url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=complete&completedTime=" + document.getElementById('time').innerHTML;
    makeAPICall(APICall, updateScoreboardResponse);
    setUpdateTimer();
}
function updateScoreboard(){
    var APICall = url + "?gamelink=" + gamelink + "&playerName=" + playerName + "&getInfo=players";
    makeAPICall(APICall, updateScoreboardResponse);
}
function updateScoreboardResponse(serverResp){
    playerList = serverResp;
    document.getElementById('scoreboard').innerHTML = '<div class="scoreboard-title"> Scoreboard </div>';
    for(let i = 0; i < playerList[1]['players'].length; i++){
        document.getElementById('scoreboard').innerHTML += '<div class="scoreboard-names">' + playerList[1]['players'][i] + '</div>';
        document.getElementById('scoreboard').innerHTML += '<div class="scoreboard-times">' + playerList[2]['completionTime'][i] + '</div>';
    }
    if(!playerList[2]['completionTime'].includes('--:--:--')){
        clearInterval(updatePlayers);
        nextGame();
    }
}
function nextGame(){
    setTimeout(function(){
        document.getElementById('scoreboard').innerHTML += '<div class="scoreboard-title"> All players finished! Back to lobby in 3 seconds... </div>';
    }, 2000);
    setTimeout(function(){
        document.getElementById('output').innerHTML = '<div class="resultOutput standard"> Output displayed here</div>';
        updateWaitingRoom();
        console.log("Next");
    }, 3000);
}