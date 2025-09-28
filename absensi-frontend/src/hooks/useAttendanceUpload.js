import { useState } from "react";
import useAttendance from "./useAttendance";

const useAttendanceUpload = (authFetch, dashboardUser, refreshAttendance) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async () => {
    if (!dashboardUser || !file) return;
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("employeeId", dashboardUser._id);
    const response = await authFetch(`http://${import.meta.env.VITE_API_BASE_URL}/api/attendance/`, {
      method: "POST",
      body: formData,
    });
    if (response && response.ok) {
      const data = await response.json();
      if(refreshAttendance) {
        refreshAttendance();
      }
      console.log("Attendance logged successfully:", data);
    } else {
      console.error("Error logging attendance:", response.statusText);
    }
  };

  return { file, setFile, isDragging, setIsDragging, handleUpload };
};

export default useAttendanceUpload;