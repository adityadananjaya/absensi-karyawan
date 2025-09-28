import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import useAuthFetch from "../utils/useAuthFetch";
import useRolesAndDepartments from "../hooks/useRolesAndDepartments";

const EmployeeForm = () => {
  // Component state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  // Hooks
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const { id } = useParams();
  const { user, fetchUserData, logout } = useContext(UserContext);

  // Fetch employee data if editing
  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          const response = await authFetch(
            `http://${import.meta.env.VITE_API_BASE_URL}/api/employees/${id}`,
            { method: "GET" }
          );
          if (response && response.ok) {
            const data = await response.json();
            setName(data.name);
            setPhone(data.phone);
            setEmail(data.email);
            setRole(data.role);
            setDepartment(data.department);
          } else {
            console.error("Failed to fetch employee data");
            navigate(`/dashboard/${id}`);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
          navigate(`/dashboard/${id}`);
        }
      };
      fetchEmployee();
    }
  }, [id]);

  const { roles, departments } = useRolesAndDepartments(logout);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { name, phone, email, role, department };
    if (password) body.password = password;

    try {
      if (id) {
        const response = await authFetch(
          `http://${import.meta.env.VITE_API_BASE_URL}/api/employees/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (response && response.ok) {
          const data = await response.json();
          await fetchUserData(); // Refresh user data in context
          console.log("Employee updated:", data);
          navigate(`/dashboard/${id}`);
        }
      } else {
        const response = await authFetch(`http://${import.meta.env.VITE_API_BASE_URL}/api/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response && response.ok) {
          const data = await response.json();
          console.log("Employee created:", data);
        } else {
          console.error("Failed to create employee");
        }
        navigate("/employees");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="grid p-20 place-content-center">
      <div className="border rounded-md p-6 w-3xl min-h-75 shadow-lg border-gray-300">
        {/* Form Header */}
        <h1 className="font-semibold text-3xl text-gray-900 ">
          {id ? "Edit Employee" : "Add New Employee"}
        </h1>
        <p className="text-sm text-gray-500 mt-3 mb-5 border-b pb-3 border-b-gray-200">
          {id
            ? "Edit employee account."
            : "Create a new employee account. All fields are required."}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Name Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  required
                  className="block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="+1234567890"
                  required
                  className="block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="employee_email"
                  autoComplete="new-email"
                  placeholder="name@dexa.org"
                  required
                  className="block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="employee_password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Your password"
                  required={!id}
                  readOnly={!!id}
                  className={`block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300
                    ${!!id && "bg-gray-100 cursor-not-allowed"}`}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            {/* Department Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Department
              </label>
              <div className="mt-1">
                <select
                  name="department"
                  className={`block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300
                    ${user?.role !== "Admin" && "bg-gray-100 cursor-not-allowed"}`}
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                  defaultValue=""
                  required
                  disabled={user?.role !== "Admin"}
                >
                  <option value="" disabled className="text-gray-700">
                    Select department
                  </option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  name="role"
                  required
                  className={`block w-full grow rounded-md outline-1 outline-gray-300 py-1.5 pr-24 pl-2 text-base focus:outline-blue-300
                    ${user?.role !== "Admin" && "bg-gray-100 cursor-not-allowed"}`}
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  defaultValue=""
                  disabled={user?.role !== "Admin"}
                >
                  <option value="" disabled className="text-gray-700">
                    Select role
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-between col-span-2">
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    id ? navigate("/dashboard/" + id) : navigate("/employees/");
                  }}
                  className="rounded-md border border-transparent bg-gray-50 py-2 px-4 text-md font-medium text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-green-600 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {id ? "Update Employee" : "Create Employee"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;