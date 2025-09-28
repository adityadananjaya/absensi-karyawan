import { useState, useEffect } from "react";

import { fetchEmployees } from "../utils/fetchEmployees";

const useAttendances = ({
  authFetch,
  user,
  logout,
  navigate,
  date,
  page,
  recordsPerPage,
  search,
  loading,
}) => {
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const fetchAttendances = async () => {
      if ((!user && !loading) || (user && user.role !== "Admin")) {
        logout();
        navigate("/");
        console.log("Logged out");
        return;
      }

      let url;


      try {
        const response = await authFetch(`https://${import.meta.env.VITE_API_BASE_URL}/api/attendance?date=${date}`, {
          method: "GET",
        });
        if (response && response.ok) {
          const data = await response.json();
          console.log("Attendances fetched:", data);
          setAttendances(data);
          // Handle the fetched attendance data here
        } else {
          console.error("Failed to fetch attendances");
        }
      } catch (error) {
        console.error("Error fetching attendances:", error);
      }
      // Fetch employees
      const responseEmployees = await fetchEmployees({
        page,
        recordsPerPage,
        search,
        authFetch,
      });
      if (responseEmployees) {
        setEmployees(responseEmployees);
        console.log("Employees fetched:", responseEmployees);
      } else {
        console.error("Failed to fetch employees");
      }
    };
    fetchAttendances();
  }, [page, date, search]);

  return { employees, attendances };
};

export default useAttendances;
