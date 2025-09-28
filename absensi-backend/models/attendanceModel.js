const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Employee" },
    loggedAt: { type: Date, default: Date.now },
    photoUrl: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("Attendance", attendanceSchema);