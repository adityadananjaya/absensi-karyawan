import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import useAuthFetch from "../utils/useAuthFetch";
import {
  fetchEmployees,
  filterEmployees,
  getIconColors,
} from "../utils/fetchEmployees";
import { UsersIcon } from "@heroicons/react/24/solid";

import Avatar from "./Avatar";
import PaginationControls from "./PaginationControls";
import SearchBar from "./SearchBar";
import usePagination from "../hooks/usePagination";

const Employees = () => {
  // Context and navigation hooks
  const { user, logout, loading } = useContext(UserContext);
  const navigate = useNavigate();

  // Component state
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination state
  const { page, setPage, nextPage, prevPage } = usePagination();
  const recordsPerPage = 10;

  // Utility hooks
  const authFetch = useAuthFetch();
  const iconColors = getIconColors();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Fetch employees data
  useEffect(() => {
    if ((!user && !loading) || (user && user.role !== "Admin")) {
      logout();
      navigate("/");
      console.log("Logged out");
      return;
    }

    const getEmployees = async () => {
      const employees = await fetchEmployees({
        page,
        recordsPerPage,
        search,
        authFetch,
      });
      if (employees) {
        setEmployees(employees);
      }
    };

    getEmployees();
  }, [user, page, search, logout, navigate]);

  // Filter employees based on search
  const filteredEmployees = filterEmployees(employees, search);

  return (
    <div className="max-w-7xl mt-10 mx-auto bg-gray-50 shadow-md rounded-2xl p-6">
      {/* Header Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <UsersIcon className="w-8 h-8 text-gray-600" />
          <h1 className="text-4xl font-bold">Employees</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Manage all employees and their details.
        </p>

        {/* Search and Add Employee Button */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees…"
              className="w-full rounded-lg border bg-white border-gray-300 px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => navigate("/employees/create")}
            className="inline-flex items-center gap-2 sm:self-auto rounded-lg bg-green-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-lg leading-none">＋</span> Add Employee
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-xl border border-gray-200">
        <table className="min-w-full table-auto overflow-x-auto">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <EmployeeRow
                key={employee._id}
                employee={employee}
                iconColors={iconColors}
                navigate={navigate}
              />
            ))}
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

const EmployeeRow = ({ employee, iconColors, navigate }) => (
  <tr
    key={employee._id}
    className="border-t border-gray-200 hover:bg-blue-50 odd:bg-white even:bg-gray-50 cursor-pointer"
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
    <td className="px-4 py-2">{employee.phone}</td>
    <td className="px-4 py-2">{employee.department}</td>
    <td className="px-4 py-2">{employee.role}</td>
  </tr>
);

export default Employees;
