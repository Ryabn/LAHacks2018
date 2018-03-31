var baseCode;
var codeMirror;

var problemSet = {
    "description": "Given n of 1 or more, return the factorial of n, which is n * (n-1) * (n-2) ... 1. Compute the result recursively (without loops).",
    "code": "function factorial(intNum){\n\treturn 100;\n}\n",
    'test': ['factorial(1)', 'factorial(2)', 'factorial(3)', 'factorial(4)', 'factorial(5)', 'factorial(6)', 'factorial(7)', 'factorial(8)', 'factorial(12)'],
    'solution': [1, 2, 6, 24, 120, 720, 5040, 40320, 479001600]
}

function load(){
    parseProblemData();
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