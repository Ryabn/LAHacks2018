const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var problemSet = {
    "description": "Given n of 1 or more, return the factorial of n, which is n * (n-1) * (n-2) ... 1. Compute the result recursively (without loops).",
    "code": "function factorial(intNum){\n\treturn 100;\n}\n",
    'test': ['factorial(1)', 'factorial(2)', 'factorial(3)', 'factorial(4)', 'factorial(5)', 'factorial(6)', 'factorial(7)', 'factorial(8)', 'factorial(12)'],
    'solution': [1, 2, 6, 24, 120, 720, 5040, 40320, 479001600]
}
app.get('/', function(req, res){
    
    res.send("woooo");
});

function returnProblemSet(){
    
    
}

const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Example app listening at http://${host}:${port}`);
});