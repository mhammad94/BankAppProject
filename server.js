const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
app.use(express.json());


//Serving JS & CSS Files 
app.use('/static', express.static('Main Files'));

//Serving HTML Files
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/app.html'));
});

// New User Registration API
app.post('/api/CustomerInformation', (req, res) => {
    let JsonFile = fs.readFileSync('app.json');
    let IncomingData = req.body;
    let JsonData = JSON.parse(JsonFile);
    JsonData.push(IncomingData);
    let FinalData = JSON.stringify(JsonData, 'null', 2);
    fs.writeFileSync('app.json', FinalData);
});

// User Authentication API
app.get('/api/CustomerInformation', (req, res) => {
    let DataFile = 'app.json';
    let data = fs.readFileSync(DataFile);
    res.send(data);
});

// User Data Update API
app.put('/api/CustomerInformation/:id', (req, res) => {
    let Id = parseInt(req.params.id);
    let JsonFile = fs.readFileSync('app.json');
    let JsonData = JSON.parse(JsonFile);
    let UserInfo = JsonData;
    let Balance = req.body.Balance;
    let index = UserInfo.findIndex((UserInfo) => {
        return (UserInfo.id == Id);
    });
    UserInfo[index].Balance = Balance;
    let FinalData = JSON.stringify(UserInfo, 'null', 2);
    fs.writeFileSync('app.json', FinalData);
});

app.listen(8080);