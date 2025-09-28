const express = require("express");
const multer = require("multer");
const path = require("path");
const {logAttendance, getAttendanceHistory, getTodayAttendance, getAllAttendanceForDay} = require("../controllers/attendanceController");
const validateToken = require("../middlewares/validateTokenHandler");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.use(validateToken);

router.route('/').get(getAllAttendanceForDay)

router.post('/', upload.single('photo'), logAttendance)
router.route('/history/').get(getAttendanceHistory)
router.get('/history/:id', getAttendanceHistory)
router.route('/today/:id').get(getTodayAttendance)

module.exports = router;