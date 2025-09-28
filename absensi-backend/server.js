const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/dbConnection");
const app = express()
const cors = require("cors");
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
const dotenv = require("dotenv").config()

const port = process.env.PORT;
connectDB();

app.use(express.json());
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use(errorHandler);

const fs = require("fs");
const path = require("path");

// to store uploaded images
const uploadDir = path.join(__dirname, "uploads");

// if folder doesn't exist, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads/ folder");
}

app.use('/uploads', express.static(uploadDir));


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})