//var employees = [];
//var departments = [];
var fs = require('fs');

const Sequelize = require('sequelize');
var sequelize = new Sequelize('ddgbgr3c6putpl', 'mkxxfeakmykxlc', '8c21d1eb0e1f41d5c5b40a9820b7e9a2027c371e2b37d16ebcf8e4c207b8d565', {
    host: 'ec2-174-129-227-205.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
   });

   var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,  
        autoIncrement: true  
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

var exports =  module.exports = {};

exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(Employee){
            resolve();
        }).then(function(Department){
            resolve();
        }).catch(function(){
            reject("unable to sync the database");
        });

    });
}

exports.getAllEmployees = function () {
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(function(){
            resolve(Employee.findAll());
        }).catch(function(){
         reject("No results returned");
        });
    });
}

exports.getManagers = function () {
    return new Promise((resolve, reject)=>{
        reject();
    });
}

exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Department.findAll().then((data) => {
            console.log("success")
            resolve(data);
        }).catch(() => {
            reject("getDepartments error");
            console.log("error")
        })
    });
}


// Part3.Step3. Adding "addEmployee" function within data-service.js
exports.addEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (const prop in employeeData) {
        if (employeeData[prop] == "") {
            employeeData[prop] = null;
        }
    }

    console.log(employeeData)
    return new Promise(function (resolve, reject) {
        Employee.create({
 
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate


        }).then(() => {
            resolve("create employee");

        }).catch(() => {
            reject("unable to create employee");
        });

    });    
};

//Part 5: Updating "data-service.js" to support the new "Employee" routes

//Part5.Step1. Add the getEmployeesByStatus(status) Function
exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            resolve(Employee.findAll({
                where: {
                    status: status
                }
            }));
        }).catch(function () {
            reject("No results returned");
        })
    });
}

//Part5.Step2. Add the getEmployeesByDepartment(department) Function
exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(){
            resolve(Employee.findAll({
             where: {
                 department: department
             }
         }));
        }).catch(function(){
         reject("No results returned");
        });  
 });
}

//Part5.Step3. Add the getEmployeesByManager(manager) Function
exports.getEmployeesByManager = function(mgr){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function(){
            resolve(Employee.findAll({
                where: {
                    employeeManagerNum: mgr
                }
            }));         
        }).catch(function(){
            reject("No results returned");
        });
    })
}

exports.updateEmployee = function (data) {
    return new Promise ((resolve, reject)=>{
        empData.isManager = (empData.isManager) ? true : false;
        for(var prop in empData){
            if(empData[prop] == ""){
                empData[prop] = null;
            }
        }
        sequelize.sync().then(function(){
            resolve(Employee.update({
                firstName: empData.firstName,
                lastName: empData.lastName,
                email: empData.email,
                SSN: empData.SSN,
                addressStreet: empData.addressStreet,
                addressCity: empData.addressCity,
                addressState: empData.addressState,
                addressPostal: empData.addressPostal,
                maritalStatus: empData.maritalStatus,
                isManager: empData.isManager,
                employeeManagerNum: empData.employeeManagerNum,
                status: empData.status,
                department: empData.department,
                hireDate: empData.hireDate
            }, {
                where: { employeeNum: empData.employeeNum }
            }));
        }).catch(function(){
            reject("unable to update employee");
        });
    });
}

//Part5.Step4. Add the getEmployeeByNum(num) Function
exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch(() => {
            reject("no result returned");
            console.log("getEmployeeByNum error")
        })
    });
}


// Assignment5
exports.addDepartment = function (departmentData) {
    for (const prop in departmentData) {
        if (departmentData[prop] == "") {
            departmentData[prop] = null;
        }
    }
    console.log(departmentData);
    console.log(departmentData.departmentName);
    return new Promise(function (resolve, reject) {
        Department.create({
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve("add new department");
        }).catch(() => {
            reject("unable to addDepartment");
        });
    });
}


// Assignment5
exports.getDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {departmentId: id}
        }).then((data) => {
            console.log("success")
            resolve(data[0]);
        }).catch(() => {
            console.log("error")
            reject("no resultd");
        })
    });
}


module.exports.deleteDepartmentById = function (departmentId) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            resolve(Department.destroy({
                where: { departmentId: departmentId }
            }));
        }).catch(function (err) {
            reject("rejected.");
        });
    });
}

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            resolve(Employee.destroy({
                where: { employeeNum: empNum }
            }));
        }).catch(function (err) {
            reject("rejected.");
        });
    });
}
