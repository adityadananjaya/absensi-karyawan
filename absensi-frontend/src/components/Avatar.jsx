import React from "react";

const Avatar = ({ name, size = "w-9 h-9", bgColor = "bg-gray-300", textColor = "text-gray-600", textSize="text-sm" }) => {
  const initials = name ? name[0].toUpperCase() : "-";

  return (
    <div
      className={`${size} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-bold ${textSize}`}
      title={name || "Unknown"}
    >
      {initials}
    </div>
  );
};

export default Avatar;