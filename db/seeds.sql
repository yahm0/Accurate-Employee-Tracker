-- seed.sql
-- Use this script to populate the database with initial data

-- Insert initial departments
INSERT INTO departments (name) VALUES
('Human Resources'),
('Engineering'),
('Marketing'),
('Sales');

-- Insert initial roles
INSERT INTO roles (title, salary, department_id) VALUES
('HR Manager', 65000.00, 1),
('Software Engineer', 80000.00, 2),
('Senior Engineer', 95000.00, 2),
('Marketing Coordinator', 55000.00, 3),
('Sales Representative', 50000.00, 4);

-- Insert initial employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),  -- HR Manager has no manager
('Jane', 'Doe', 2, 1),     -- Software Engineer reports to HR Manager
('Alice', 'Smith', 3, 1),  -- Senior Engineer reports to HR Manager
('Bob', 'Brown', 4, 1),    -- Marketing Coordinator reports to HR Manager
('Charlie', 'Davis', 5, 1); -- Sales Representative reports to HR Manager

