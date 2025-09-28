import { useState, useEffect } from "react";

const useDashboardUser = (authFetch, user, id, navigate) => {
  const [dashboardUser, setDashboardUser] = useState(null);

  useEffect(() => {
    const fetchDashboardUser = async () => {
      if (!user) return;
      if (id) {
        if (user.role !== "Admin" && user._id !== id) {
          navigate("/dashboard");
          return;
        }
        const response = await authFetch(`https://${import.meta.env.VITE_API_BASE_URL}/api/employees/${id}`);
        if (response?.ok) {
          const data = await response.json();
          setDashboardUser(data);
        } else {
          navigate("/");
        }
      } else {
        setDashboardUser(user);
      }
    };
    fetchDashboardUser();
  }, [user, id, navigate]);

  return dashboardUser;
};

export default useDashboardUser;