var baseCode;
var codeMirror;
var timer;
var xhr = new XMLHttpRequest();
var url = "http://localhost:8080/";
var gamelink;

var problemSet = {};

function enterGame(){
     xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                problemSet = xhr.responseText;
                
            }
        }
    };
    xhr.open("GET", url + "?gamelink=" + gamelink, true);
    xhr.send();
}

function load(){
    startTimer();
    //parseProblemData();
}
function startTimer(){
    
    
    timer = setInterval(function(){
        displayTime();
    }, 10);
}
function displayTime(){
    var date = Date.now();
    document.getElementById('time').innerHTML = date%10000000;
        
}
function parseProblemData(){
    var problemString = problemSet['description'];
    displayProblem(problemString);
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
    document.getElementById('output').innerHTML = '';
    var userSubmission = codeMirror.getValue();
    
    for(i = 0; i < problemSet['test'].length; i++){
        var submissionTest =  userSubmission + problemSet['test'][i];
        var userOutput = eval(submissionTest);
        checkUserSubmission(userOutput, i, problemSet['test'][i]);
    }
}
function checkUserSubmission(userOutput, testNum, userInput){
    
    if(userOutput == problemSet['solution'][testNum]){
        setCorrect(userInput, userOutput);
    }else{
        setIncorrect(userInput, userOutput);
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