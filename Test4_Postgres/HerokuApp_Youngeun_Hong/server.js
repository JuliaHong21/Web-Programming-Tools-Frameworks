/* Heroku Ver.
   Web322 Test4 
   Name: Youngeun Hong
   ID: 159100171
   Email: yhong38@myseneca.ca 
   HerokuApp: https://fast-brook-72464.herokuapp.com/ 
*/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const Sequelize = require('sequelize');
const pg = require("pg");

var sequelize = new Sequelize('d4knd1is9rl23m', 'adddalnrivpfdk', 'c32b0763b78ac681c9ba3412ff12c4568aa8cf1c99e007a9a6b1b0df2b18f435', {
    host: 'ec2-54-243-47-196.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
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
            })

            Employee.create({
                empid: 4,
                name: 'Ernest Cook',
                deptnumber: 10004
            })

            Employee.create({
                empid: 5,
                name: 'Marshall Ballard',
                deptnumber: 10005
            })

            Employee.create({
                empid: 6,
                name: 'Joann Riley',
                deptnumber: 10006
            })

            Employee.create({
                empid: 7,
                name: 'Pearl Pearson',
                deptnumber: 10007
            })
        } 
    })

    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT);

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


app.get('/pool', function (req, res) {
    Employee.findAll({
        attributes: ['empid', 'name', 'deptnumber']
    }).then((data) => {
        res.send(data);
    })
});
