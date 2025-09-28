import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import useAuthFetch from "../utils/useAuthFetch";
import {
  fetchEmployees,
  filterEmployees,
  getIconColors,
} from "../utils/fetchEmployees";
import {
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

import Avatar from "./Avatar";
import PaginationControls from "./PaginationControls";
import SearchBar from "./SearchBar";
import usePagination from "../hooks/usePagination";
import useAttendances from "../hooks/useAttendances";

const Attendances = () => {
  // Pagination state
  const { page, setPage, nextPage, prevPage } = usePagination();

  // Component state
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
  });

  // Constants
  const recordsPerPage = 10;
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(UserContext);
  const iconColors = getIconColors();

  // Fetch attendance data
  const { employees, attendances } = useAttendances({
    authFetch,
    user,
    logout,
    navigate,
    date,
    page,
    recordsPerPage,
    search,
    loading,
  });

  // Filter employees based on search
  const filteredEmployees = filterEmployees(employees, search);

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mt-10 mx-auto bg-gray-50 shadow-md rounded-2xl p-6">
      {/* Header Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDaysIcon className="w-8 h-8 text-gray-600" />
          <h1 className="text-4xl font-bold">
            Attendances for {formattedDate}
          </h1>
        </div>
        <p className="text-gray-600 mb-4">
          Showing attendance records for all employees on this date.
        </p>

        {/* Search and Date Filters */}
        <div className="flex items-center gap-x-4 mb-4">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-2xl rounded-lg border bg-white border-gray-300 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search employees…"
          />
          <input
            type="date"
            className="w-64 border border-gray-300 rounded-lg bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-xl border border-gray-200">
        <table className="min-w-full table-auto overflow-x-auto">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Proof</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const record = attendances.find(
                (a) => a.employee_id._id === employee._id
              );
              return (
                <EmployeeRow
                  key={employee._id}
                  employee={employee}
                  record={record}
                  navigate={navigate}
                  iconColors={iconColors}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {search.trim() === "" && (
        <PaginationControls
          page={page}
          prevPage={prevPage}
          nextPage={nextPage}
          isFirstPage={page === 1}
        />
      )}
    </div>
  );
};

const EmployeeRow = ({ employee, record, navigate, iconColors }) => {
  return (
    <tr
      key={employee._id}
      className="border-t border-gray-200 hover:bg-gray-100 odd:bg-white even:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/dashboard/${employee._id}`)}
      title={`View dashboard for ${employee.name}`}
    >
      <td className="px-4 py-2 font-medium flex items-center gap-3">
        <Avatar
          name={employee.name}
          size="w-9 h-9"
          bgColor={iconColors[employee.name.length % iconColors.length]}
        />
        <div>
          <div>{employee.name}</div>
          <div className="text-sm text-gray-500">{employee.email}</div>
        </div>
      </td>
      <td className="px-4 py-2 text-center">
        {record ? (
          <span className="px-3 py-1 rounded-full text-sm  bg-green-100 text-green-700 font-medium inline-flex items-center gap-1">
            <CheckCircleIcon className="w-5 h-5" />
            Present
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 font-medium inline-flex items-center gap-1">
            <XCircleIcon className="w-5 h-5" />
            Absent
          </span>
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {record ? new Date(record.loggedAt).toLocaleString() : "-"}
      </td>
      <td className="px-4 py-2 text-center">
        {record ? (
          <a
            href={`https://${import.meta.env.VITE_API_BASE_URL}${record.photoUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            <CameraIcon className="w-5 h-5 inline mr-1" />
            View
          </a>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
};

export default Attendances;
