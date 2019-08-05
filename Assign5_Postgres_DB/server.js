/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Youngeun Hong______ Student ID: __159100171_____ Date: __2019-07-26______
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
var exphbs = require('express-handlebars'); //Assign4- step1


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
  //res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render("home");
});

// The route "/about" must return the about.html file from the views folder
app.get("/about", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about");
});

app.get("/employees/add", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
  res.render("addEmployee");
});

app.post("/employee/update", function(req, res){
  dataService.updateEmployee(req.body)
  .then(res.redirect('/employees'))
});

app.get("/images/add", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/addImage.html"));
  res.render("addImage");
});

/*app.get("/employees", function (req, res) {
  dataService.getAllEmployees().then((data) => {
    res.status(200).json(data); }).catch((err) => {   
    res.status(500).json({
      "message": err  });
  })
});*/

/*app.get("/managers", function (req, res) {
  dataService.getManagers().then((data) => {
    res.status(200).json(data); }).catch((err) => {
    res.status(500).json({"message": err });
  })
})*/

app.get("/departments", function(req,res) {
  dataService.getDepartments().then(function(data) {
    res.render("departments", { data });
  }).catch(function(err) {
    res.render("departments", { message: "error" });
  });
});


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
    //res.json(imageFile);
    res.render("images",  { data: imageFile, title: "Images" });
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
app.get('/employees', (req, res) => {
  if(req.query.status) {
    dataService.getEmployeesByStatus(req.query.status)
          .then((data) => res.render("employees",{employees:data}))
          .catch(() => res.render("employees",{message: "no results"}))
  } else if(req.query.manager){
    dataService.getEmployeesByManager(req.query.manager)
          .then((data) => res.render("employees",{employees:data}))
          .catch(() => res.render("employees",{message: "no results"}))
  } else if(req.query.department){ 
    dataService.getEmployeesByDepartment(req.query.department)
          .then((data) => res.render("employees",{employees:data}))
          .catch(() => res.render("employees",{message: "no results"}))
  } else{
    dataService.getAllEmployees()
          .then((data) => res.render("employees",{employees:data}))
          .catch(() => res.render("employees",{message: "no results"}))
  }
});

//Part4.Step2. Add the "/employee/value" route
//Assign5
app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  dataService.getEmployeeByNum(req.params.empNum)
    .then((data) => {
      viewData.data = data; //store employee data in the "viewData" object as "data"
    }).catch(() => {
      viewData.data = null; // set employee to null if there was an error
    }).then(dataService.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"
      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.data.department) {
          viewData.departments[i].selected = true;
        }
      }
    }).catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
      if (viewData.data == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", {
          viewData: viewData
        }); // render the "employee" view
      }
    });
});


//Assign4- step1: Install & configure express-handlebars
app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout:'main',
  helpers:{
    navLink:function(url, options){
      return '<li' + 
      ((url==app.locals.activeRoute)? ' class="active"':'')+
      '><a href="'+url+'">'+options.fn(this)+'</a></li>';
    },
    equal:function(lvalue, rvalue, options){
      if(arguments.length<3)
      throw new Error("Handlerbars Helper equal needs 2 parameters");
      if(lvalue != rvalue){
        return options.inverse(this);
      } else{
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');

//Assign4- Step 4: Fixing the Navigation Bar to Show the correct "active" item
app.use(function(req,res,next){
  let route=req.baseUrl + req.path;
  app.locals.activeRoute = (route=="/")? "/":route.replace(/\/$/,"");
  next();
});

//Assignment5: Updating Routes (server.js) to Add / Update Departments
app.get("/departments/add", function(req,res) {
  res.render("addDepartment");
});

app.post("/departments/add", function(req,res) {
  dataService.addDepartment(req.body).then(function(data) {
    res.redirect("/departments");
  }).catch(function(err) {
    res.status(500).send("Unable to Add");
  })
});

app.post("/department/update", (req, res) => {
  dataService.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((data) => {
    console.log(data)
  })
});
  
app.get("/department/:departmentId", function(req, res) {
  dataService.getDepartmentById(req.params.departmentId).then(function(data) {
    res.render("department", {
      data: data
    });
  }).catch(function(err) {
    res.status(404).send("Not Found");
  });
});
  
  app.get("/employee/delete/:empNum", function (req, res) {
    dataService.deleteEmployeeByNum(req.params.empNum).then((data) => {
      res.redirect("/employees");
      console.log(data);
    }).catch((data) => {
      console.log(data);
      res.status(500).render({
        message: "Unable to Remove / Employee not found"
      });
    })
  })
  
  
  app.get("*", function (req, res) {  
    res.status(404).send("404 Error ");  
  })