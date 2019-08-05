var employees = [];
var departments = [];
var fs = require('fs');
var exports =  module.exports = {};

var readEmployees = function () {
    return new Promise(function (resolve, reject) {
        fs.readFile('./data/employees.json', function (err, data) {
            if (!err) {                
                employees = JSON.parse(data);
                resolve(); 
            } else {          
                reject("can not read employees");
            }
        })
    })
}

var readDepartments = function () {
    return new Promise(function (resolve, reject) {
        fs.readFile('./data/departments.json', function (err, data) {
            if (!err) {
                departments = JSON.parse(data);
                resolve();
            } else {                
                reject("can not read departments");
            }
        })
    })
}

exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length) {
            console.log("return all employees")
            resolve(employees);            
        } else {
            console.log("no results returned");
            reject("no results returned");
        }
    })
}

exports.getManagers = function () {
    var isManager = employees.filter(
        function (employees) {
            return employees.isManager == true;
        }
    )

    return new Promise(function (resolve, reject) {
        if (!isManager.length) {
            console.log("no results returned");
            reject();
        } else {
            console.log(isManager);
            resolve(isManager);
        }
    })
}

exports.getDepartments = function () { 
    return new Promise(function (resolve, reject) {
        if (!departments.length) {
            console.log("no results returned");
            reject();
        } else {
            console.log("return all departments")
            resolve(departments);
        }
    })
}

exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        readEmployees().then(readDepartments).then(function () {
            console.log("read employees");
            console.log("read department");
            resolve();
        })
        .catch(function (errmsg) {
            console.log(errmsg);
            reject(errmsg);
        });
    })
}