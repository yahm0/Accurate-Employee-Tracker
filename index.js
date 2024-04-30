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
