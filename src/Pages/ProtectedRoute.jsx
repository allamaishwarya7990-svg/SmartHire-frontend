
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "../services/api";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const user = authApi.getCurrentUser();

  // No authenticated session
  if (!user?.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Normalize the stored role
  const userRole = String(user.role || "")
    .trim()
    .toUpperCase();

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).trim().toUpperCase()
  );

  // If a role is required, verify it
  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(userRole)
  ) {
    if (userRole === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (userRole === "RECRUITER") {
      return <Navigate to="/recruiter-dashboard" replace />;
    }

    if (userRole === "JOB_SEEKER") {
      return <Navigate to="/jobseeker-dashboard" replace />;
    }

    // Unknown or missing role
    return <Navigate to="/login" replace />;
  }

  return children;
}
