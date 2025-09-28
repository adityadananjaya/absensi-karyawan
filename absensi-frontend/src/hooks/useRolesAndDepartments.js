import { useEffect, useState } from "react";

const useRolesAndDepartments = (logout) => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchRolesAndDepartments = async () => {
      const token = localStorage.getItem("login_token");
      if (!token) {
        logout();
        return;
      }

      try {
        const response = await fetch(`http://${import.meta.env.VITE_API_BASE_URL}/api/employees/meta`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setRoles(data.roles);
        setDepartments(data.departments);
      } catch (error) {
        console.error("Error fetching roles and departments:", error);
      }
    };

    fetchRolesAndDepartments();
  }, [logout]);

  return { roles, departments };
};

export default useRolesAndDepartments;