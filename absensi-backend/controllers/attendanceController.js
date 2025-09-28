const Attendance = require("../models/attendanceModel");
const Employee = require("../models/employeeModel");
const asyncHandler = require("express-async-handler");
2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helper function
async function hasLoggedToday(employeeId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return await Attendance.findOne({
    employee_id: employeeId,
    loggedAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

// list of APIs
// log attendance for a certain employee
// @desc  Log attendance for a certain employee
// @route POST /api/attendance
// @access private
const logAttendance = asyncHandler(async (req, res) => {
  const employeeId = req.employee._id;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  employee = await Employee.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error("You are not registered as an employee.");
  }
  if (!photoUrl) {
    res.status(400);
    throw new Error("Photo is required for attendance logging.");
  }

  const alreadyLogged = await hasLoggedToday(employeeId);
  if (alreadyLogged) {
    res.status(400);
    throw new Error("Attendance already logged for today.");
  }

  const attendance = await Attendance.create({
    employee_id: employeeId,
    photoUrl,
  });

  if (attendance) {
    res.status(201).json(attendance);
  } else {
    res.status(400);
    throw new Error("Invalid attendance data");
  }
});

// get history of attendance records for a certain employee
// @desc  Get attendance history for a certain employee
// @route GET /api/attendance/:id
// @access private
const getAttendanceHistory = asyncHandler(async (req, res) => {
  const employeeId = req.params.id || req.employee.id;
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error("You are not registered as an employee.");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const attendanceRecords = await Attendance.find({ employee_id: employeeId })
    .sort({ loggedAt: -1 })
    .skip(skip)
    .limit(limit);
  res.status(200).json(attendanceRecords);
});

// get attendance information for a certain employee (check that the employee has attended for the day)
// @desc  Get attendance information for that day for a certain employee
// @route GET /api/attendance/today/:id
// @access private
const getTodayAttendance = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("You are not registered as an employee.");
  }

  const attendanceRecord = await hasLoggedToday(employee.id);

  if (attendanceRecord) {
    res.status(200).json({ attended: true, attendance: attendanceRecord });
  } else {
    res.status(200).json({ attended: false });
  }
});

// get all attendance record for a certain day for all employees (ADMIN ONLY)
// @desc  Get all attendance record for a certain day for all employees
// @route GET /api/attendance
// @access private (admin only)
const getAllAttendanceForDay = asyncHandler(async (req, res) => {
  if (req.employee.role !== "Admin") {
    res.status(403);
    throw new Error("You are not authorized to access this route.");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { date } = req.query; // expect date in YYYY-MM-DD format
  if (!date) {
    res.status(400);
    throw new Error("Date invalid.");
  }
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  let attendanceRecords;
  if (req.query.page && req.query.limit) {
    attendanceRecords = await Attendance.find({
      loggedAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("employee_id", "name email")
      .skip(skip)
      .limit(limit);
  } else {
    attendanceRecords = await Attendance.find({
      loggedAt: { $gte: startOfDay, $lte: endOfDay },
    }).populate("employee_id", "name email");
  }

  res.status(200).json(attendanceRecords);
});

module.exports = {
  logAttendance,
  getAttendanceHistory,
  getTodayAttendance,
  getAllAttendanceForDay,
};
