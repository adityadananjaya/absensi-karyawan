const mongoose = require("mongoose");


// name, email, phone, role, department
const employeeSchema = mongoose.Schema({
    name: { type: String, required: [true, "Employee name is needed"] },
    email: { type: String, required: [true, "Employee email is needed"], unique: [true, "Email address already taken"] },
    password: { type: String, required: [true, "Password is needed"] },
    phone: { type: String, required: [true, "Employee phone number is needed"]},
    role: { type: String, required: [true, "Employee role is needed"] },
    department: { type: String, required: [true, "Employee department is needed"] },
}, {
    timestamps: true
});

module.exports = mongoose.model("Employee", employeeSchema);