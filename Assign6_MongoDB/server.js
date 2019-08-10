/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Youngeun Hong______ Student ID: __159100171_____ Date: __2019-08-09______
*
* Online (Heroku) Link: https://boiling-woodland-40950.herokuapp.com/ 
*
********************************************************************************/

var express = require('express');
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
var multer = require('multer');
var fs = require('fs');
var bodyParser = require("body-parser");
var HTTP_PORT = process.env.PORT || 8080;
var dataServiceAuth = require("./data-service-auth");
const clientSessions = require('client-sessions');


var storage = multer.diskStorage({
  destination: "./public/images/uploaded", filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


var upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.use(express.static('public'));


app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "Assign06_159100171", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
})
);


app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});


app.use(bodyParser.urlencoded({
  extended: false
})
);


function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};


dataService.initialize().then(dataServiceAuth.initialize()).then(() => {
  app.listen(HTTP_PORT, onHttpStart);
}).catch((errmsg) => {
  console.error(errmsg + " this is from server.js");
});


app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});


const exphbs = require('express-handlebars');


app.engine('.hbs', exphbs({
  extname: ".hbs",
  defaultLayout: 'main',
  helpers: {
    equal: (lvalue, rvalue, options) => {
      if (arguments.length < 3)
        throw new Error("needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    navLink: (url, options) => {
      return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') 
      + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    }
  }
})
);


app.set('view engine', '.hbs');

app.get("/", (req, res) => {
  res.render("home");
});


app.get("/about", function (req, res) {
  res.render("about");
});


app.get("/departments", ensureLogin, function (req, res) {
  dataService.getDepartments().then(function (data) {
    res.render("departments", { data });
  }).catch(function (err) {
    res.render("departments", { message: "error" });
  });
});


app.get("/managers", function (req, res) {
  dataService.getManagers().then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({
      "message": err,
      user: req.session.user
    });
  });
});


app.get("/employees/add", ensureLogin, function (req, res) {
  dataService.getDepartments().then((data) => {
    res.render("addEmployee", {
      departments: data,
      user: req.session.user
    });
  }).catch(() => {
    res.render("addEmployee", {
      departments: []
    });
  });
});


app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});


app.get("/images/add", ensureLogin, (req, res) => {
  res.render("addImage");
});


app.get("/images", ensureLogin, (req, res) => {
  fs.readdir("./public/images/uploaded", function (err, items) {
    res.render('images', { images: items })
  });
});


app.post('/employees/add', ensureLogin, function (req, res) {
  dataService.addEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch((err) => res.json({ "message": err }))
});


app.get('/employees', ensureLogin, (req, res) => {
  if (req.query.status) {
    dataService.getEmployeesByStatus(req.query.status)
      .then((data) => res.render("employees", { employees: data }))
      .catch(() => res.render("employees", { message: "no results" }))
  } else if (req.query.manager) {
    dataService.getEmployeesByManager(req.query.manager)
      .then((data) => res.render("employees", { employees: data }))
      .catch(() => res.render("employees", { message: "no results" }))
  } else if (req.query.department) {
    dataService.getEmployeesByDepartment(req.query.department)
      .then((data) => res.render("employees", { employees: data }))
      .catch(() => res.render("employees", { message: "no results" }))
  } else {
    dataService.getAllEmployees()
      .then((data) => {         
        console.log(data)        
        res.render("employees", { employees: data }) }
      )
      .catch(() => res.render("employees", { message: "no results" }))
  }
});


app.get("/employee/:empNum", ensureLogin, (req, res) => {
  let viewData = {};
  dataService.getEmployeeByNum(req.params.empNum)
    .then((data) => {
      viewData.data = data;
    }).catch(() => {
      viewData.data = null;
    }).then(dataService.getDepartments)
    .then((data) => {
      viewData.departments = data;
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.data.department) {
          viewData.departments[i].selected = true;
        }
      }
    }).catch(() => {
      viewData.departments = [];
    }).then(() => {
      if (viewData.data == null) {
        res.status(404).send("Not Found");
      } else {
        res.render("employee", {
          viewData: viewData,
          user: req.session.user
        });
      }
    });
});


app.post("/employee/update", ensureLogin, (req, res) => {
  dataService.updateEmployee(req.body)
    .then(res.redirect('/employees'))
});


app.get("/departments/add", ensureLogin, (req, res) => {
  res.render('addDepartment');
});


app.post("/departments/add", ensureLogin, (req, res) => {
  dataService.addDepartment(req.body).then(function (data) {
    res.redirect("/departments");
  }).catch(function (err) {
    res.status(500).send("Unable to Add");
  })
});


app.post("/department/update", ensureLogin, (req, res) => {
  dataService.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((data) => {
    console.log(data);
  })
});


app.get("/department/:departmentId", ensureLogin, (req, res) => {
  dataService.getDepartmentById(req.params.departmentId).then(function (data) {
    res.render("department", {
      data: data
    });
  }).catch(function (err) {
    res.status(404).send("Not Found");
  });
});


app.get("/employee/delete/:empNum", ensureLogin, function (req, res) {
  dataService.deleteEmployeeByNum(req.params.empNum).then((data) => {
    res.redirect("/employees");
    console.log(data);
  }).catch((data) => {
    console.log(data);
    res.status(500).render({
      message: "Cannot Remove"
    });
  })
});


app.get("/departments/delete/:departmentId", ensureLogin, function (req, res) {
  dataService.deleteDepartmentById(req.params.departmentId)
      .then(() => {
          res.redirect("/departments");
      })
      .catch(() => {
          res.status(500).send("Not found")
      })
});


app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  dataServiceAuth.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      }
      res.redirect('/employees');
    }).catch((err) => {
      res.render('login', { errorMessage: err, userName: req.body.userName });
    });
});


app.get("/register", (req, res) => {
  res.render('register');
});

app.post("/register", (req, res) => {
  dataServiceAuth.registerUser(req.body)
    .then((value) => {
      res.render('register', { successMessage: "User created" });
    }).catch((err) => {
      res.render('register', { errorMessage: err, userName: req.body.userName });
    })
});


app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect('/');
});


app.get("/userHistory", ensureLogin, (req, res) => {
  res.render('userHistory');
});


app.get("*", function (req, res) {
  res.status(404).send("NOT FOUND");
});