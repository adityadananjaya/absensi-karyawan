const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");

//@desc Get alll employees
//@route GET /api/employees
//@access public
const getEmployees = asyncHandler(async (req, res) => {
  if (!req.employee || req.employee.role !== "Admin") {
    res.status(403);
    throw new Error("You are not authorized to access this route.");
  }

  let employees;

  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    employees = await Employee.find().skip(skip).limit(limit);
  } else {
    employees = await Employee.find();
  }

  res.status(200).json(employees);
});

//@desc Create new employee
//@route POST /api/employees
//@access private
const createEmployee = asyncHandler(async (req, res) => {
  console.log(req.body);

  if (!req.employee || req.employee.role !== "Admin") {
    res.status(403);
    throw new Error("Only admin can create new employee");
  }

  const { name, email, password, phone, role, department } = req.body;
  if (!name || !email || !password || !phone || !role || !department) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  const employeeAvailable = await Employee.findOne({ email });
  if (employeeAvailable) {
    res.status(400);
    throw new Error("Employee already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password: ", hashedPassword);

  const employee = await Employee.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    department,
  });

  if (employee) {
    res
      .status(201)
      .json({ _id: employee.id, name: employee.name, email: employee.email });
  } else {
    res.status(400);
    throw new Error("Invalid employee data");
  }
});

//@desc Get data of particular person
//@route GET /api/employees/:id
//@access public
const getEmployee = async (req, res) => {


  if (!(req.employee.role === "Admin" || req.employee._id === req.params.id)) {
    res.status(403);
    throw new Error("You are not authorized to access this route.");
  }
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.status(200).json(employee);
};

//@desc Update employee info
//@route PUT /api/employees/:id
//@access public
const updateEmployee = async (req, res) => {
  if (
    !req.employee ||
    (req.employee._id !== req.params.id && req.employee.role !== "Admin")
  ) {
    res.status(403);
    throw new Error("You are not authorized to access this route.");
  }
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  const updateEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json({ updateEmployee });
};

//@desc Delete particular person
//@route DELETE /api/employees/:id
//@access public
const deleteEmployee = async (req, res) => {
  if (!req.employee || req.employee.role !== "Admin") {
    res.status(403);
    throw new Error("You are not authorized to access this route.");
  }
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  await Employee.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: `Delete person` });
};

// @desc Login employee
// @route POST /api/employees/login
// @access public
const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }
  const employee = await Employee.findOne({ email });
  if (employee && (await bcrypt.compare(password, employee.password))) {
    const accessToken = jwt.sign(
      {
        employee,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc Logged in as
// @route POST /api/employees/current
// @access private
// const currentEmployee = asyncHandler(async (req, res) => {
//     res.send("Current employee");
// });
const currentUser = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.employee._id); // Fetch latest data
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.status(200).json(employee); // Return the latest data
});

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  getEmployee,
  deleteEmployee,
  loginEmployee,
  currentUser,
};
