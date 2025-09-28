const express = require("express");
const router = express.Router();
const { getEmployees, createEmployee, updateEmployee, getEmployee, deleteEmployee, loginEmployee, currentUser } = require("../controllers/employeeController");
const validateToken = require("../middlewares/validateTokenHandler");

router.route("/login").post(loginEmployee);

router.use(validateToken);

router.route('/').get(getEmployees).post(createEmployee);
// GET roles and departments metadata
router.get('/meta', (req, res) => {
    /* Hardcoded for now, in a real application this data should be stored in a separate database */
	const roles = [  "Admin",
            "HR Manager",
            "Finance Manager",
            "Software Engineer",
            "Sales Executive",
            "Marketing Specialist",
            "Operations Supervisor",
            "IT Support",
            "Customer Service Representative",
            "Project Manager",
            "Business Analyst",
            "Intern",
            "Executive Assistant",
            "Product Owner",
            "Quality Assurance"
    ];
	const departments = ["HR", "Finance", "Engineering", "Sales", "Marketing", "Operations", "IT", "Customer Service"];
	res.json({ roles, departments });
});

router.get("/current", validateToken, currentUser);

router.route('/:id').put(updateEmployee).get(getEmployee).delete(deleteEmployee);

module.exports = router