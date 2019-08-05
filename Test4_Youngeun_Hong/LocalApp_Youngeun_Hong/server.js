/* Local Ver.
   Web322 Test4 
   Name: Youngeun Hong
   ID: 159100171
   Email: yhong38@myseneca.ca
   HerokuApp: https://serieux-chaise-67615.herokuapp.com/
 */

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const Sequelize = require('sequelize')
var pg = require("pg");

var sequelize = new Sequelize('postgres', 'postgres', 'yhong38', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: false
    }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });


app.get("/", (req, res) => {
    Employee.findAll({
        attributes: ['empid', 'name', 'deptnumber'],
        where: { empid: 1 }
    }).then((data) => {
        res.send(data);
    })    
});
        
app.get("/sp", (req, res) => {
    Employee.findAll({
        attributes: ['empid', 'name', 'deptnumber']
    }).then((data) => {
        res.send(data);
    })
});    
    
var config = {
    user: 'postgres',
    database: 'postgres',
    password: 'yhong38',  
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};


var pool = new pg.Pool(config);

app.get('/pool', function (req, res) {
    pool.connect( function (err, client, done) {
        if (err) {
            console.log("connection error" + err);
            res.status(400).send(err);
        }
        Employee.findAll({
            attributes: ['empid', 'name', 'deptnumber']
        }).then((data) => {
            res.send(data);
            done();
        })
    });
});  
    
const Employee = sequelize.define("Employee", {
    empid: Sequelize.INTEGER,
    name: Sequelize.TEXT,
    deptnumber: Sequelize.INTEGER
});

sequelize.sync().then(() => {
    Employee.findAll().then((data) => {        
        if (data.length == 0) {
            Employee.create({
                empid: 1,
                name: 'Youngeun Hong',  //my name
                deptnumber: 10001
            });
            
            Employee.create({
                empid: 2,
                name: 'Billy John',
                deptnumber: 10002            
            });

            Employee.create({
                empid: 3,
                name: 'Smith George',
                deptnumber: 10003
            });

            Employee.create({
                empid: 4,
                name: 'Ernest Cook',
                deptnumber: 10004
            });

            Employee.create({
                empid: 5,
                name: 'Marshall Ballard',
                deptnumber: 10005
            });

            Employee.create({
                empid: 6,
                name: 'Joann Riley',
                deptnumber: 10006
            });

            Employee.create({
                empid: 7,
                name: 'Pearl Pearson',
                deptnumber: 10007
            });
        } 
    })
   
    app.listen(HTTP_PORT); // setup http server to listen on HTTP_PORT
});


