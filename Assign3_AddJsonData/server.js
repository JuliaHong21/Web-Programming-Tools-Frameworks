/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Youngeun Hong______ Student ID: __159100171_____ Date: __2019-06-14______
*
* Online (Heroku) Link:  https://sleepy-savannah-97375.herokuapp.com/
*
********************************************************************************/

var express = require('express');
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var dataService = require('./data-service');
var multer = require('multer');  //Part2.Step1
var fs = require('fs');  //Part2.Step3
var bodyParser = require("body-parser"); //Part3.Step1

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

app.get("/employees/add", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.get("/images/add", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/addImage.html"));
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


//Part 2: Adding Routes / Middleware to Support Image Uploads

//Part2.Step1. Adding multer
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {   
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//Part2.Step2. Adding the "Post" route
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
}); 

//Part2. Step3. Adding "Get" route / using the "fs" module
app.get("/images", (req, res) => {
  fs.readdir("./public/images/uploaded", function(err, imageFile){
    res.json(imageFile);
  })
})


//Part 3: Adding Routes / Middleware to Support Adding Employees

//Part3.Step1. Adding body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//Part3.Step2. Adding "Post" route
app.post('/employees/add', function(req, res) {
  dataService.addEmployee(req.body)
  .then(res.redirect('/employees'))
  .catch((err) => res.json({"message": err}))   
}) 


//Part 4: Adding New Routes to query "Employees"

//Part4.Step1. Update the "/employees" route
app.get("/employees", function(req, res){
  if(req.query.status){
    data.getEmployeesByStatus(req.query.status)
    .then(function(data){res.json(data);})
    .catch(function(err){res.send(err);})
  }
  else if(req.query.department){
    data.getEmployeesByDepartment(req.query.department)
    .then(function(data){res.json(data);})
    .catch(function(err){res.send(err);})
  }
  else if(req.query.manager){
    data.getEmployeesByManager(req.query.manager)
    .then(function(data){res.json(data);})
    .catch(function(err){res.send(err);})
  }
  else{
    data.getAllEmployees().then(function(data){res.json(data);})
        .catch(function(err){res.send(err);})
  }    
}); 

//Part4.Step2. Add the "/employee/value" route
app.get('/employee/:employeeNum', (req, res) => {
  dataService.getEmployeesByNum(req.params.employeeNum)
  .then((data) => {res.json(data);})
});

app.get("*", function (req, res) {  
  res.status(404).send("404 Error ");  
})