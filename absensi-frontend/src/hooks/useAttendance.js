import { useState, useEffect } from "react";

const useAttendance = (authFetch, dashboardUser) => {
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    const checkAttendance = async () => {
      if (!dashboardUser) return;
      const response = await authFetch(
        `http://${import.meta.env.VITE_API_BASE_URL}/api/attendance/today/${dashboardUser._id}`
      );
      if (!response) return; // Token expired, user logged out
      const data = await response.json();
      setAttendance(data);
    };
    checkAttendance();
  }, [dashboardUser]);
  return attendance;
};
export default useAttendance;
