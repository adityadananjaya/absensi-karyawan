import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import useAuthFetch from "../utils/useAuthFetch";
import {
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  PencilSquareIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

import { getIconColors } from "../utils/fetchEmployees";
import { getLastNDates } from "../utils/dateUtils";
import Avatar from "./Avatar";
import PaginationControls from "./PaginationControls";

import useDashboardUser from "../hooks/useDashboardUser";
import useAttendanceHistory from "../hooks/useAttendanceHistory";
import usePagination from "../hooks/usePagination";

const Dashboard = () => {
  // Context and navigation hooks
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Utility hooks
  const authFetch = useAuthFetch();
  const { page, setPage, nextPage, prevPage } = usePagination();

  // Constants
  const recordsPerPage = 10;
  const iconColors = getIconColors();

  // Fetch data hooks
  const dashboardUser = useDashboardUser(authFetch, user, id, navigate);
  const [attendance, setAttendance] = useState(null);
  const attendanceHistory = useAttendanceHistory(
    dashboardUser,
    page,
    attendance,
    authFetch,
    recordsPerPage
  );

  // Attendance upload state
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async () => {
    if (!dashboardUser || !file) return;
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("employeeId", dashboardUser._id);
    const response = await authFetch(
      `http://${import.meta.env.VITE_API_BASE_URL}/api/attendance/`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (response && response.ok) {
      const data = await response.json();
      checkAttendance();
      console.log("Attendance logged successfully:", data);
    } else {
      console.error("Error logging attendance:", response.statusText);
    }
  };

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  const checkAttendance = async () => {
    if (!dashboardUser) return;
    const response = await authFetch(
      `http://${import.meta.env.VITE_API_BASE_URL}/api/attendance/today/${
        dashboardUser._id
      }`
    );
    if (!response) return; // Token expired, user logged out
    const data = await response.json();
    setAttendance(data);
  };

  useEffect(() => {
    checkAttendance();
  }, [dashboardUser]);

  // Loading state
  if (loading || !dashboardUser) {
    return <div>Loading...</div>;
  }

  // Derived data
  const lastNDates = getLastNDates(recordsPerPage, page);

  return (
    <div>
      {/* User Info Section */}
      <div className="max-w-7xl mt-10 mx-auto bg-gray-50 shadow-md rounded-2xl p-8 flex items-start gap-8">
        <Avatar
          name={dashboardUser.name}
          size="w-32 h-32"
          bgColor={iconColors[dashboardUser.name.length % iconColors.length]}
          textColor="text-gray-600"
          textSize="text-5xl"
        />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">{dashboardUser.name}</h1>
              <h2 className="text-lg italic text-gray-600">
                {dashboardUser.role} – {dashboardUser.department}
              </h2>
            </div>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
              onClick={() => navigate(`/employees/edit/${dashboardUser._id}`)}
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <ContactInfo dashboardUser={dashboardUser} />
        </div>
      </div>

      {/* Attendance Status Section */}
      <div className="max-w-7xl mt-10 mx-auto bg-gray-50 shadow-md rounded-2xl p-6">
        <AttendanceStatus
          attendance={attendance}
          dashboardUser={dashboardUser}
          user={user}
        />

        {/* Attendance Upload Section */}
        {attendance?.attended === false && dashboardUser._id === user._id && (
          <div>
            <div
              className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 py-30 mx-5 ${
                isDragging ? "bg-blue-50" : "bg-white"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                setFile(droppedFile);
                setIsDragging(false);
              }}
            >
              <div className="text-center">
                {file ? (
                  <div>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="mx-auto max-h-96 mb-2 rounded"
                    />
                    <p className="text-sm text-gray-700">{file.name}</p>
                  </div>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      data-slot="icon"
                      aria-hidden="true"
                      className="mx-auto size-24 text-gray-300"
                    >
                      <path
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-lg/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          type="file"
                          name="file-upload"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-sm/5 mt-2 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {file && (
              <div className="mt-6">
                <button
                  type="button"
                  className="rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleUpload}
                >
                  Log your attendance
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attendance History Section */}
      <div className="max-w-7xl mt-10 mx-auto bg-gray-50 shadow-md rounded-2xl p-6">
        <h2 className="mb-10 text-2xl">Attendance History</h2>
        <AttendanceHistoryTable
          lastNDates={lastNDates}
          attendanceHistory={attendanceHistory}
        />
        <PaginationControls
          page={page}
          prevPage={prevPage}
          nextPage={nextPage}
          isFirstPage={page === 1}
        />
      </div>
    </div>
  );
};

// Contact information component
const ContactInfo = ({ dashboardUser }) => (
  <div className="mt-4 space-y-2 text-gray-700">
    <p className="flex items-center gap-2">
      <PhoneIcon className="w-5 h-5 text-gray-400" />
      {dashboardUser.phone}
    </p>
    <p className="flex items-center gap-2">
      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
      {dashboardUser.email}
    </p>
  </div>
);

// Attendance status component
const AttendanceStatus = ({ attendance, dashboardUser, user }) => {
  if (attendance === null) {
    return <p>Loading attendance status...</p>;
  }

  if (attendance.attended) {
    return (
      <div>
        <div className="text-green-700 text-3xl font-semibold mb-1">
          <CheckCircleIcon className="w-9 h-9 inline mr-2" />
          {dashboardUser._id === user._id
            ? "You have logged your attendance for today. Have a great day!"
            : `${dashboardUser.name} has logged their attendance for today.`}
        </div>
        <h1 className="font-mono text-gray-600 text-lg mt-1 mb-4 ml-12 flex">
          <span>
            Timestamp:{" "}
            {attendance.attendance?.createdAt
              ? new Date(attendance.attendance.createdAt).toLocaleString()
              : "-"}{" "}
          </span>
        </h1>
        <img
          src={`http://${import.meta.env.VITE_API_BASE_URL}${
            attendance.attendance.photoUrl
          }`}
          alt="Preview"
          className="h-96 mb-2 rounded ml-12"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="text-red-700 text-3xl font-semibold mb-1">
        <ExclamationCircleIcon className="w-9 h-9 inline mr-2" />
        {dashboardUser._id === user._id
          ? "Oh no, it seems you have not logged your attendance for today!"
          : `Oh no, it seems ${dashboardUser.name} has not logged their attendance for today!`}
      </div>
      <h1 className="text-gray-600 text-lg mt-1 mb-4 ml-12 flex">
        <span>
          {dashboardUser._id === user._id
            ? "Don't forget to upload a photo to check-in."
            : "Ask them to upload a photo to check-in."}
        </span>
      </h1>
    </div>
  );
};

// Attendance history table component
const AttendanceHistoryTable = ({ lastNDates, attendanceHistory }) => (
  <div className="rounded-xl border border-gray-200">
    <table className="min-w-full table-auto overflow-x-auto">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Logged at</th>
          <th className="px-4 py-2">Proof</th>
        </tr>
      </thead>
      <tbody>
        {lastNDates.map((date) => {
          const dateString = date.toISOString().slice(0, 10);
          const record = attendanceHistory.find((record) =>
            record.loggedAt?.startsWith(dateString)
          );
          return (
            <tr
              key={dateString}
              className="text-center border-t border-gray-200 hover:bg-gray-100 odd:bg-white even:bg-gray-50"
            >
              <td className="px-4 py-2 font-medium tabular-nums">
                {dateString}
              </td>
              <td
                className={`px-4 py-2 ${
                  record ? "text-green-600" : "text-red-600"
                }`}
              >
                {record ? (
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium inline-flex items-center gap-1">
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
              <td className="px-4 py-2">
                {record ? new Date(record.loggedAt).toLocaleString() : "-"}
              </td>
              <td className="px-4 py-2">
                {record ? (
                  <a
                    href={`http://${import.meta.env.VITE_API_BASE_URL}${
                      record.photoUrl
                    }`}
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
        })}
      </tbody>
    </table>
  </div>
);

export default Dashboard;
