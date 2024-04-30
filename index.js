// Required modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');  // Correct usage for console.table

// Load environment variables
require('dotenv').config();

// Create a database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,  // Default to 3306 if DB_PORT is not specified
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database.');
  runMainMenu();
});

// Function to display the main menu and handle user input
function runMainMenu() {
    inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ]
    })
    .then(answer => {
        switch(answer.action) {
          case 'View All Departments':
            viewDepartments();
            break;
          case 'View All Roles':
            viewRoles();
            break;
          case 'View All Employees':
            viewEmployees();
            break;
          case 'Add a Department':
            addDepartment();
            break;
          case 'Add a Role':
            addRole();
            break;
          case 'Add an Employee':
            addEmployee();
            break;
          case 'Update an Employee Role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connection.end();
            console.log('Goodbye!');
            break;
        }
      });
    }
    
        // Defines the functions called in the switch statement above for database operations
        function viewDepartments() {
            // SQL query to fetch departments and display them using console.table
            const query = 'SELECT * FROM departments';
            connection.query(query, (err, res) => {
              if (err) throw err;
              console.table(res);
              runMainMenu();  // Return to the main menu after displaying
            });
          }


          // Function to view all roles in the database
function viewRoles() {
    const query = `SELECT roles.role_id, roles.title, departments.name AS department, roles.salary
                   FROM roles
                   INNER JOIN departments ON roles.department_id = departments.department_id`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runMainMenu();
    });
  }


  // Function to view all employees and their details
function viewEmployees() {
    const query = `SELECT employees.employee_id, employees.first_name, employees.last_name, 
                   roles.title AS job_title, departments.name AS department, roles.salary, 
                   CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                   FROM employees
                   LEFT JOIN roles ON employees.role_id = roles.role_id
                   LEFT JOIN departments ON roles.department_id = departments.department_id
                   LEFT JOIN employees manager ON employees.manager_id = manager.employee_id`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runMainMenu();
    });
  }
  
  // Function to add a new department to the database
function addDepartment() {
    inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'What is the name of the department?',
    }).then(answer => {
      const query = 'INSERT INTO departments (name) VALUES (?)';
      connection.query(query, answer.name, (err, res) => {
        if (err) throw err;
        console.log(`Added ${answer.name} to departments.`);
        runMainMenu();
      });
    });
  }

  // Function to add a new role to the database
function addRole() {
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for the role?',
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please enter a valid number.';
        }
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'What is the department ID for this role?',
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please enter a valid department ID.';
        }
      }
    ]).then(answers => {
      const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
      connection.query(query, [answers.title, answers.salary, answers.department_id], (err, res) => {
        if (err) throw err;
        console.log(`Added ${answers.title} to roles.`);
        runMainMenu();
      });
    });
  }

  // Function to add a new employee to the database
function addEmployee() {
    inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'What is the employee\'s first name?',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the employee\'s last name?',
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'What is the role ID for this employee?',
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please enter a valid role ID.';
        }
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'What is the manager ID for this employee (enter if applicable, else leave blank)?',
        validate: value => {
          if (value === '' || isNaN(value) === false) {
            return true;
          }
          return 'Please enter a valid manager ID or leave blank.';
        },
        default: null
      }
    ]).then(answers => {
      const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      connection.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null], (err, res) => {
        if (err) throw err;
        console.log(`Added ${answers.first_name} ${answers.last_name} to employees.`);
        runMainMenu();
      });
    });
  }
  
  // Function to update the role of an existing employee in the database
function updateEmployeeRole() {
    inquirer.prompt([
      {
        name: 'employee_id',
        type: 'input',
        message: 'Enter the ID of the employee whose role you want to update:',
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please enter a valid employee ID.';
        }
      },
      {
        name: 'new_role_id',
        type: 'input',
        message: 'Enter the new role ID for the employee:',
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return 'Please enter a valid role ID.';
        }
      }
    ]).then(answers => {
      const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';
      connection.query(query, [answers.new_role_id, answers.employee_id], (err, res) => {
        if (err) throw err;
        console.log(`Updated role for employee ID ${answers.employee_id}.`);
        runMainMenu();
      });
    });
  }