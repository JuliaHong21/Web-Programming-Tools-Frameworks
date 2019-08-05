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

// Part3.Step3. Adding "addEmployee" function within data-service.js
exports.addEmployee = function(employeeData){
    if(!employeeData.isManager){
        employeeData.isManager = false;
    } else{
        employeeData.isManager = true;
    }   
    employeeData.employeeNum = employees.length+1;
    employees.push(employeeData);
    return new Promise((resolve, reject) => {
        resolve(employees);
        if(employees.length == 0){
            reject("Nothing found");
        }        
    });
};

//Part 5: Updating "data-service.js" to support the new "Employee" routes

//Part5.Step1. Add the getEmployeesByStatus(status) Function
exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        let tempArray = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].status == data)
                tempArray.push(employees[i]);
        }
       
        if (tempArray.length) {
            resolve(tempArray);
        } else {
            reject("no result returned");
        }
    })
}

//Part5.Step2. Add the getEmployeesByDepartment(department) Function
exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        let tempArray = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].department == data)
                tempArray.push(employees[i]);
        }        
        if (tempArray.length) {
            resolve(tempArray);
        } else {
            reject("no result returned");
        }
    })
}

//Part5.Step3. Add the getEmployeesByManager(manager) Function
exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        let tempArray = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == data)
                tempArray.push(employees[i]);
        }
      
        if (tempArray.length) {
            resolve(tempArray);
        } else {
            reject("no result returned");
        }
    })
}

exports.updateEmployee = function (data) {
    return new Promise((resolve, reject) => {
        console.log(data);       
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == data.employeeNum) {              
                employees[i] = data
                console.log('overwrite success')
                resolve();
                return;
            }
        }
        console.log('can not overwrite');
        reject("no result");
    })
}

//Part5.Step4. Add the getEmployeeByNum(num) Function
exports.getEmployeeByNum = function (data) {
    return new Promise((resolve, reject) => {
        let tempArray = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == data)
                tempArray.push(employees[i]);
        }        
        if (tempArray.length) {
            resolve(tempArray);
        } else {
            reject("no result returned");
        }
    })
}