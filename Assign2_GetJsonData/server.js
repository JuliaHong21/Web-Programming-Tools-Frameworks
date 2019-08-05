/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Youngeun Hong______ Student ID: __159100171_____ Date: __2019-05-31______
*
* Online (Heroku) Link: __https://sleepy-savannah-97375.herokuapp.com/_____
*
********************************************************************************/

var express = require('express');
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var dataService = require('./data-service');

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT); 
}

app.use(express.static('public'));

dataService.initialize().then(() => { 
  app.listen(HTTP_PORT, onHttpStart);}).catch((errmsg) => {
  console.error(errmsg + " this is from server.js");
})

// The route "/" must return the home.html file from the views folder
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// The route "/about" must return the about.html file from the views folder
app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", function (req, res) {
  dataService.getAllEmployees().then((data) => {
    res.status(200).json(data); }).catch((err) => {   
    res.status(500).json({
      "message": err  });
  })
});

app.get("/managers", function (req, res) {
  dataService.getManagers().then((data) => {
    res.status(200).json(data); }).catch((err) => {
    res.status(500).json({"message": err });
  })
})

app.get("/departments", function (req, res) {  
  dataService.getDepartments().then((data)=> {
    res.status(200).json(data); }).catch((err)=>{   
    res.status(500).json({"message": err});
  })
})


app.get("*", function (req, res) {  
  res.status(404).send("404 Error ");
})

