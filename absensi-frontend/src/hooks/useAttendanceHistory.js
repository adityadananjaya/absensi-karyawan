import { useState, useEffect } from "react";

const useAttendanceHistory = (dashboardUser, page, attendance, authFetch, recordsPerPage) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (!dashboardUser) return;
      const response = await authFetch(
        `http://${import.meta.env.VITE_API_BASE_URL}/api/attendance/history/${dashboardUser._id}?page=${page}&limit=${recordsPerPage}`
      );
      if (!response) return; // Token expired, user logged out
      const data = await response.json();
      if (response.ok) {
        setAttendanceHistory(data);
      } else {
        console.error(
          "Error fetching attendance history:",
          response.statusText
        );
      }
    };

    fetchAttendanceHistory();
  }, [dashboardUser, page, attendance]);

  return attendanceHistory;
};

export default useAttendanceHistory;
