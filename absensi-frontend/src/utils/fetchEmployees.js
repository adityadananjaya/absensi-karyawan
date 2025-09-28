import useAuthFetch from "./useAuthFetch";

const fetchEmployees = async ({
  page = 1,
  recordsPerPage = 10,
  search = "",
  authFetch,
}) => {
  try {
    let url;
    if (search.trim() === "") {
      url = `https://${import.meta.env.VITE_API_BASE_URL}/api/employees?page=${page}&limit=${recordsPerPage}`;
    } else {
      url = `https://${import.meta.env.VITE_API_BASE_URL}/api/employees`;
    }

    const response = await authFetch(url, {
      method: "GET",
    });
    if (response && response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch employees");
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

const filterEmployees = (employees, search) => {
  return employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase()) ||
      employee.role.toLowerCase().includes(search.toLowerCase())
  );
};

const getIconColors = () => {
  return [
    "bg-red-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-indigo-300",
    "bg-gray-300",
    "bg-teal-300",
    "bg-orange-300",
  ];
};

export { fetchEmployees, filterEmployees, getIconColors };
